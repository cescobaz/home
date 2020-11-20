from gpiozero import Button
from webthing import (Property, Thing, Value)
import asyncio
import tornado.ioloop
import tornado.gen
import threading

def update_button_value_in_loop(button, value, state, loop):
    print(state)
    loop.call_soon_threadsafe(lambda: value.notify_of_external_update(state))

def update_value(value, state):
    print('update button value ')
    value.notify_of_external_update(state)

def update_button_value_in_ioloop(button, value, state, loop):
    print(state)
    loop.spawn_callback(lambda: update_value(value, state))

def make_black_button(pin):
    thing = Thing(
        'urn:dev:ops:black-button-0',
        'kitchen black button',
        ['PushButton'],
        'kitchen black button'
    )
    value = Value(False)
    thing.add_property(
        Property(thing,
                 'pushed',
                 value,
                 metadata={
                     '@type': 'PushedProperty',
                     'title': 'Pushed',
                     'type': 'boolean',
                     'description': 'Whether the button is pressed',
                     'readOnly': True,
                 }))
    button = Button(pin)
    # loop = asyncio.get_event_loop()
    loop = tornado.ioloop.IOLoop.current()
    action = lambda is_pressed: update_button_value_in_ioloop(button, value, is_pressed, loop)
    button.when_pressed = lambda: action(False)
    button.when_released = lambda: action(True)
    return thing
