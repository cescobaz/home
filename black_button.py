from gpiozero import Button
from webthing import (Property, Thing, Value)

def updateValue(button, value):
    newValue = True if button.value == 1 else False
    value.notify_of_external_update(newValue)

def make_black_button(pin):
    thing = Thing(
        'urn:dev:ops:black-button-0',
        'kitchen black button',
        ['PushButton'],
        'kitchen black button'
    )
    value = Value(True)
    thing.add_property(
        Property(thing,
                 'push-button',
                 value,
                 metadata={
                     '@type': 'PushButton',
                     'title': 'black-button',
                     'type': 'boolean',
                     'description': 'Whether the button is pressed',
                     'readOnly': True,
                 }))
    button = Button(pin)
    button.when_pressed = lambda: updateValue(button, value)

    return thing

