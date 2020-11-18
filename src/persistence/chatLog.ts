import nedb from 'nedb';

let Datastore = nedb
  , db = new Datastore({ filename: 'data/log.db', autoload: true });