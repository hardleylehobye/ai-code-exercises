# Observer Pattern: Weather Station

## What changed

- **Before:** `WeatherStation` had private methods for each display (`updateCurrentConditionsDisplay`, etc.) and called them directly inside `setMeasurements`. Adding a new display required editing the subject and adding another method.
- **After:** `WeatherStation` holds a list of `WeatherObserver` and, on `setMeasurements`, notifies each observer with the new data. Each display is a separate class implementing `WeatherObserver` (e.g. `CurrentConditionsDisplay`, `StatisticsDisplay`). The subject no longer knows display details; it only calls `observer.update(t, h, p, output)`.

## Benefits

- **Maintainability:** Add or remove a display by registering/unregistering an observer; no change to the subject’s core logic.
- **Open/closed:** New display types (e.g. “UV display”) = new class implementing `WeatherObserver` + one `registerObserver` call; subject stays unchanged.
- **Testability:** Each display can be unit tested by calling `update` with fixed values and asserting on the `output` list. The subject can be tested with mock observers.
- **Loose coupling:** The station does not depend on concrete display classes; it depends only on the `WeatherObserver` interface.

## Future changes made easier

- New display (e.g. mobile push): implement `WeatherObserver` and register.
- Conditional displays (e.g. only in debug): register observers based on config.
- Different notification channels (e.g. log file, API): observers can write to different sinks; subject unchanged.
- Remove a display: remove from the observers list or don’t register it.
