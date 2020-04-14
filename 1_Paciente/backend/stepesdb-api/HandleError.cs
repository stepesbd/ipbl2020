using Newtonsoft.Json;
using System.Net;

namespace stepesdb_api.Controllers
{
    public class ApiError
    {
        public int status { get; private set; }

        public string StatusDescription { get; private set; }

        [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
        public string Message { get; private set; }

        public ApiError(int status, string statusDescription)
        {
            this.status = status;
            this.StatusDescription = statusDescription;
        }

        public ApiError(int status, string statusDescription, string message) : this(status, statusDescription)
        {
            this.Message = message;
        }
    }

    public class InternalServerError : ApiError
    {
        public InternalServerError(): base(500, HttpStatusCode.InternalServerError.ToString())
        {
        }

        public InternalServerError(string message) : base(500, HttpStatusCode.InternalServerError.ToString(), message)
        {
        }
    }

    public class NotFound : ApiError
    {
        public NotFound() : base(404, HttpStatusCode.NotFound.ToString())
        {
        }

        public NotFound(string message) : base(404, HttpStatusCode.NotFound.ToString(), message)
        {
        }
    }

    public class BadRequest : ApiError
    {
        public BadRequest() : base(400, HttpStatusCode.BadRequest.ToString())
        {
        }

        public BadRequest(string message) : base(400, HttpStatusCode.BadRequest.ToString(), message)
        {
        }
    }

    public class Ok : ApiError
    {
        public Ok() : base(200, HttpStatusCode.OK.ToString())
        {
        }

        public Ok(string message) : base(200, HttpStatusCode.OK.ToString(), message)
        {
        }
    }
}