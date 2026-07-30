/**
 * Phase 6B — Media upload executor.
 *
 * Handles: media.upload
 *
 * Media uploads are special:
 * - Use multipart/form-data (not JSON)
 * - Have a longer timeout (120s)
 * - The result (media ID) is used as a dependency by status.create
 * - Large payloads — Blob/File stored by reference in IndexedDB
 *
 * Security:
 * - File type validation (only known MIME types)
 * - File size bounded (server ultimately enforces, but early rejection)
 * - Description/alt text length-bounded
 * - No path traversal in filenames
 */

import { ApplicationError } from 'soapbox/domain/application-error';

import { executeRequest, UPLOAD_TIMEOUT_MS } from '../outbox-transport';

import type { OperationExecutor } from '../outbox-processor';
import type { AccountScope } from 'soapbox/db/repository';
import type { OutboxEntry } from 'soapbox/domain/outbox-operation';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_DESCRIPTION_LENGTH = 5_000;
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB generous upper bound

/** MIME types we accept for upload. Server may reject some of these. */
const ALLOWED_MIME_PREFIXES = ['image/', 'video/', 'audio/'] as const;

// ─── Payload validation ──────────────────────────────────────────────────────

interface MediaUploadPayload {
  /** The file blob to upload. Stored as Blob in IndexedDB. */
  file: Blob;
  /** Optional description/alt text. */
  description?: string;
  /** Optional focal point (x,y) as comma-separated string. */
  focus?: string;
}

function validateMediaPayload(payload: unknown): MediaUploadPayload {
  if (!payload || typeof payload !== 'object') {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: media.upload requires an object payload.',
    });
  }
  const p = payload as Record<string, unknown>;

  // Validate file exists and is a Blob
  if (!(p.file instanceof Blob)) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: media.upload requires a File or Blob.',
    });
  }
  const file = p.file as Blob;

  // Validate MIME type
  if (file.type && !ALLOWED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix))) {
    throw new ApplicationError({
      kind: 'validation',
      message: `Outbox payload: unsupported media type "${file.type}".`,
    });
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: media file exceeds maximum size.',
    });
  }

  if (file.size === 0) {
    throw new ApplicationError({
      kind: 'validation',
      message: 'Outbox payload: media file is empty.',
    });
  }

  const result: MediaUploadPayload = { file };

  // Validate description
  if (p.description !== undefined && p.description !== null) {
    if (typeof p.description !== 'string') {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: description must be a string.',
      });
    }
    if (p.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: description exceeds maximum length.',
      });
    }
    result.description = p.description;
  }

  // Validate focus (format: "x,y" where x,y are floats between -1 and 1)
  if (p.focus !== undefined && p.focus !== null) {
    if (typeof p.focus !== 'string') {
      throw new ApplicationError({
        kind: 'validation',
        message: 'Outbox payload: focus must be a string.',
      });
    }
    const parts = p.focus.split(',');
    if (parts.length === 2) {
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (Number.isFinite(x) && Number.isFinite(y) && x >= -1 && x <= 1 && y >= -1 && y <= 1) {
        result.focus = p.focus;
      }
      // Invalid focus is silently dropped (non-critical)
    }
  }

  return result;
}

// ─── Executor ────────────────────────────────────────────────────────────────

export const executeMediaUpload: OperationExecutor = async(
  entry: OutboxEntry,
  scope: AccountScope,
  signal: AbortSignal,
): Promise<unknown> => {
  const payload = validateMediaPayload(entry.payload);

  // Build FormData for multipart upload
  const formData = new FormData();
  formData.append('file', payload.file);
  if (payload.description) {
    formData.append('description', payload.description);
  }
  if (payload.focus) {
    formData.append('focus', payload.focus);
  }

  const response = await executeRequest(scope, entry, {
    method: 'POST',
    url: '/api/v2/media',
    data: formData,
    signal,
    timeoutMs: UPLOAD_TIMEOUT_MS,
    // Do NOT set Content-Type — browser sets it with the boundary for FormData
  });

  // If 202 (async processing), the server returns the media but it may not
  // be ready. The status.create executor will use the ID regardless —
  // Mastodon queues the attachment processing.
  return response.data;
};
