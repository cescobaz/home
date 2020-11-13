import Adafruit_DHT
from webthing import (Property, Thing, Value)

def update_values(sensor, pin, humidity_value, temperature_value):
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    if humidity is not None and temperature is not None:
        humidity_value.notify_of_external_update(humidity)
        temperature_value.notify_of_external_update(temperature)

def make_dht11_thing(pin):
        humidity_thing = Thing(
            'urn:dev:ops:my-humidity-sensor-1234',
            'My Humidity Sensor',
            ['MultiLevelSensor'],
            'A web connected humidity sensor'
        )
        temperature_thing = Thing(
            'urn:dev:ops:my-temperature-sensor-1234',
            'My Temperature Sensor',
            ['MultiLevelSensor'],
            'A web connected temperature sensor'
        )
        humidity_value = Value(0.0)
        temperature_value = Value(0.0)
        humidity_thing.add_property(
            Property(humidity_thing,
                     'level',
                     humidity_value,
                     metadata={
                         '@type': 'LevelProperty',
                         'title': 'Humidity',
                         'type': 'number',
                         'description': 'The current humidity in %',
                         'minimum': 0,
                         'maximum': 100,
                         'unit': 'percent',
                         'readOnly': True,
                     }))
        temperature_thing.add_property(
            Property(temperature_thing,
                     'level',
                     temperature_value,
                     metadata={
                         '@type': 'LevelProperty',
                         'title': 'Temperature',
                         'type': 'number',
                         'description': 'The current temperature in °C',
                         'minimum': -5,
                         'maximum': 50,
                         'unit': 'celsius',
                         'readOnly': True,
                     }))
        sensor = Adafruit_DHT.DHT11
        return (humidity_thing, temperature_thing, lambda: update_values(sensor, pin, humidity_value, temperature_value))
