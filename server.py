from __future__ import division, print_function
from webthing import (Action, Event, MultipleThings, Property, Thing, Value,
                      WebThingServer)
import logging
import random
import time
import tornado.ioloop
import uuid
import kitchen_lamp
import dht11_thing


def run_server():
    kitchen_lamp = make_kitchen_lamp(17)
    humidity_thing, temperature_thing, update_values = make_dht11_thing(18)
    timer = tornado.ioloop.PeriodicCallback(update_values, 3000)
    timer.start()

    server = WebThingServer(
        MultipleThings([kitchen_lamp, humidity_thing, temperature_thing],
                       'LightAndTempDevice'),
        port=8888)
    try:
        logging.info('starting the server')
        server.start()
    except KeyboardInterrupt:
        logging.debug('canceling the sensor update looping task')
        timer.stop()
        logging.info('stopping the server')
        server.stop()
        logging.info('done')


if __name__ == '__main__':
    logging.basicConfig(
        level=10,
        format="%(asctime)s %(filename)s:%(lineno)s %(levelname)s %(message)s")
    run_server()
