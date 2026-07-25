# Streaming and Upload Inventory

## Streaming

`app/soapbox/stream.ts` owns the WebSocket client. It derives the streaming base URL from normalized instance data, obtains the current access token, subscribes under `/api/v1/streaming/`, parses JSON events, and returns an explicit disconnect function. Disconnect closes the subscription and clears polling timers. Where supplied, polling fallback waits a randomized bounded interval (20–40 seconds after a successful poll; up to 40 seconds after disconnect) and is cleared when streaming reconnects.

Known gaps are explicit: destination validation is not centralized, event payloads lack schema validation and size bounds, retry attempt/lifetime limits are not expressed, and the access-token transport depends on the third-party WebSocket client contract.

## Uploads

`app/soapbox/actions/media.ts` selects `/api/v2/media` or `/api/v1/media` from detected features and sends `FormData` with progress callbacks. Other `FormData` paths include profile media, group media, CSV imports, and administrator configuration assets. Upload mutations are not automatically retry-safe: a lost response may follow a completed server-side write. Cancellation, maximum file/request sizes, content-type allowlists, server processing polling, and orphan cleanup must remain callsite-visible until a scoped upload adapter enforces them.

The generated endpoint manifest is the exhaustive source-location index; filtering it by `contentType: multipart-or-callsite-defined`, route containing `media`, or `kind: websocket-client` yields the current transfer boundaries.
