# Keyboard and Gesture Inventory

Status: **Phase 0F complete / executable**

The generated `behaviors` list is the callsite-level inventory. It captures keyboard handlers and `HotKeys`, programmatic/autofocus and tab stops, touch/swipe/pull interactions, and motion callsites.

| Surface | Existing behavior | Required migration baseline |
|---|---|---|
| Global UI and timelines | `react-hotkeys`, status/notification navigation | shortcuts must not fire in editable controls; document conflicts; preserve visible focus |
| Menus and language selection | arrows/Enter/Escape plus focus movement/restoration | roving focus, Escape close, trigger restoration, no focus loss |
| Modal root and overlays | active-element capture and restoration | focus containment, initial focus, Escape close where safe, exact restoration |
| Audio/video | keyboard handlers and native button controls | retain Space/Enter and seek/volume behavior without gesture dependence |
| Swipeable media/onboarding/announcements | horizontal swipe/page selection | always provide visible previous/next controls and announce page changes |
| Pull to refresh/touch suggestions | touch gesture | retain a non-gesture refresh/select path and cancel safely |

Gesture handlers must tolerate cancellation, pointer changes, nested scrolling, and RTL. They must not trigger destructive actions without confirmation. Keyboard commands must use semantic controls and must not replace native browser or assistive-technology shortcuts.
