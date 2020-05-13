using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MySql2MongoDBWithMQTT
{   
    public class AttendanceMongo
    {        
        [BsonId()]
        public ObjectId Id { get; set; }

        [BsonElement("Name")]
        [BsonRequired()]
        public string Name { get; set; }

        [BsonElement("LastName")]
        [BsonRequired()]
        public string LastName { get; set; }

        [BsonElement("Active")]
        [BsonRequired()]
        public bool Active { get; set; }
    }
}