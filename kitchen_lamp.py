from gpiozero import LED
from webthing import (Property, Thing, Value)

def switch_led(led, value):
    if value:
        led.on()
    else:
        led.off()

def make_kitchen_lamp(pin):
    thing = Thing(
        'urn:dev:ops:my-lamp-1234',
        'kitchen lamp',
        ['OnOffSwitch'],
        'kitchen lamp'
    )
    led = LED(pin)

    thing.add_property(
        Property(thing,
                 'on',
                 Value(True, lambda v: switch_led(led, v)),
                 metadata={
                     '@type': 'OnOffProperty',
                     'title': 'On/Off',
                     'type': 'boolean',
                     'description': 'Whether the lamp is turned on',
                 }))

    return thing
