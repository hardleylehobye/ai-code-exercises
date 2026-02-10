// Refactored with Observer pattern: displays register and are notified on measurement change
import java.util.ArrayList;
import java.util.List;

/** Observer interface: notified when weather data changes */
interface WeatherObserver {
    void update(float temperature, float humidity, float pressure, List<String> output);
}

/** Subject: holds measurements and notifies all registered observers */
public class WeatherStation {
    private float temperature;
    private float humidity;
    private float pressure;
    private final List<WeatherObserver> observers = new ArrayList<>();

    public WeatherStation() {
        this.temperature = 0.0f;
        this.humidity = 0.0f;
        this.pressure = 0.0f;
        // Register default displays (could be injected or added later)
        registerObserver(new CurrentConditionsDisplay());
        registerObserver(new StatisticsDisplay());
        registerObserver(new ForecastDisplay());
        registerObserver(new HeatIndexDisplay());
    }

    public void registerObserver(WeatherObserver observer) {
        observers.add(observer);
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;

        List<String> displayUpdates = new ArrayList<>();
        for (WeatherObserver o : observers) {
            o.update(this.temperature, this.humidity, this.pressure, displayUpdates);
        }
        for (String update : displayUpdates) {
            System.out.println(update);
        }
    }

    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }

    public static void main(String[] args) {
        WeatherStation station = new WeatherStation();
        System.out.println("--- Weather Update 1 ---");
        station.setMeasurements(80.0f, 65.0f, 30.4f);
        System.out.println("\n--- Weather Update 2 ---");
        station.setMeasurements(82.0f, 70.0f, 29.2f);
    }
}

// Concrete observers (extracted from original private methods)
class CurrentConditionsDisplay implements WeatherObserver {
    @Override
    public void update(float temperature, float humidity, float pressure, List<String> output) {
        output.add(String.format("Current conditions: %.1f°F, %.1f%% humidity", temperature, humidity));
    }
}

class StatisticsDisplay implements WeatherObserver {
    @Override
    public void update(float temperature, float humidity, float pressure, List<String> output) {
        output.add(String.format("Weather statistics: Avg/Max/Min temperature = %.1f/%.1f/%.1f",
                temperature - 2, temperature + 2, temperature - 5));
    }
}

class ForecastDisplay implements WeatherObserver {
    @Override
    public void update(float temperature, float humidity, float pressure, List<String> output) {
        String prediction = pressure < 29.92f ? "Watch out for cooler, rainy weather" : "Improving weather on the way!";
        output.add("Forecast: " + prediction);
    }
}

class HeatIndexDisplay implements WeatherObserver {
    @Override
    public void update(float temperature, float humidity, float pressure, List<String> output) {
        float heatIndex = (temperature + humidity) / 2;
        output.add(String.format("Heat index: %.1f", heatIndex));
    }
}
