/**
 * Phase 6 — Executor registry.
 *
 * Registers all operation executors with the outbox processor.
 * Call registerAllExecutors() once at app startup before the processor
 * begins ticking.
 *
 * Adding a new executor:
 * 1. Create the executor function in the appropriate file
 * 2. Import it here
 * 3. Add the registerExecutor() call in registerAllExecutors()
 */

import { registerExecutor } from '../outbox-processor';

import {
  executeAccountBlock,
  executeAccountFollow,
  executeAccountMute,
  executeAccountUnblock,
  executeAccountUnfollow,
  executeAccountUnmute,
} from './account-executors';
import {
  executeStatusBookmark,
  executeStatusFavourite,
  executeStatusMute,
  executeStatusPin,
  executeStatusReblog,
  executeStatusUnbookmark,
  executeStatusUnfavourite,
  executeStatusUnmute,
  executeStatusUnpin,
  executeStatusUnreblog,
} from './interaction-executors';
import { executeMediaUpload } from './media-executor';
import {
  executeMarkerUpdate,
  executeNotificationDismiss,
  executeNotificationsClear,
  executePollVote,
  executeReportCreate,
} from './misc-executors';
import {
  executeStatusCreate,
  executeStatusDelete,
  executeStatusEdit,
} from './status-executors';

/**
 * Register all executors with the outbox processor.
 * Must be called exactly once at startup.
 * Idempotent — safe to call multiple times (last registration wins).
 */
export function registerAllExecutors(): void {
  // Status CRUD
  registerExecutor('status.create', executeStatusCreate);
  registerExecutor('status.edit', executeStatusEdit);
  registerExecutor('status.delete', executeStatusDelete);

  // Status interactions
  registerExecutor('status.favourite', executeStatusFavourite);
  registerExecutor('status.unfavourite', executeStatusUnfavourite);
  registerExecutor('status.reblog', executeStatusReblog);
  registerExecutor('status.unreblog', executeStatusUnreblog);
  registerExecutor('status.bookmark', executeStatusBookmark);
  registerExecutor('status.unbookmark', executeStatusUnbookmark);
  registerExecutor('status.pin', executeStatusPin);
  registerExecutor('status.unpin', executeStatusUnpin);
  registerExecutor('status.mute', executeStatusMute);
  registerExecutor('status.unmute', executeStatusUnmute);

  // Media
  registerExecutor('media.upload', executeMediaUpload);

  // Polls
  registerExecutor('poll.vote', executePollVote);

  // Account relationships
  registerExecutor('account.follow', executeAccountFollow);
  registerExecutor('account.unfollow', executeAccountUnfollow);
  registerExecutor('account.block', executeAccountBlock);
  registerExecutor('account.unblock', executeAccountUnblock);
  registerExecutor('account.mute', executeAccountMute);
  registerExecutor('account.unmute', executeAccountUnmute);

  // Reports
  registerExecutor('report.create', executeReportCreate);

  // Notifications
  registerExecutor('notification.dismiss', executeNotificationDismiss);
  registerExecutor('notifications.clear', executeNotificationsClear);

  // Markers
  registerExecutor('marker.update', executeMarkerUpdate);
}
