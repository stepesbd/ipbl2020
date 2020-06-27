import axios from "axios";

const urlApiPaciente = process.env.REACT_APP_API_ENDPOINT_PATIENT;
const urlApiMedico = process.env.REACT_APP_API_ENDPOINT_DOCTOR;

const UseGetApi = (url, endpoint) => {
  try {
    const urlComplete = (url == "P" ? urlApiPaciente : urlApiMedico) + endpoint;
    return axios
      .get(urlComplete)
      .then(result => {
        var newResult = {
          status: result.status,
          data: result.data,
          headers: result.headers
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var message = "";
          if (error.response.data.message)
            message = error.response.data.message;
          else message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message: message
          };
          return newError;
        } else {
          var result = {
            status: 500,
            message: "Erro ao conectar com api."
          };
          return result;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UsePostApi = (url, endpoint, obj) => {
  try {
    const urlComplete = (url == "P" ? urlApiPaciente : urlApiMedico) + endpoint;
    const headers = { headers: { "Content-Type": "application/json" } };
    return axios
      .post(urlComplete, obj, headers)
      .then(result => {
        var newResult = {
          status: result.status,
          message: "Cadastro realizado com sucesso!",
          data: result.data,
          headers: result.headers
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var message = "";
          if (error.response.data.message)
            message = error.response.data.message;
          else message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message: message
          };
          return newError;
        } else {
          var result = {
            status: 500,
            message: "Erro ao conectar com api."
          };
          return result;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UsePutApi = (url, endpoint, id, obj) => {
  try {
    const urlComplete =
      (url == "P" ? urlApiPaciente : urlApiMedico) + endpoint + id;
    const headers = { headers: { "Content-Type": "application/json" } };
    return axios
      .put(urlComplete, obj, headers)
      .then(result => {
        if (result.data.status) {
          let newResult = {
            status: result.data.status,
            message: result.data.message
          };
          return newResult;
        } else {
          let newResult = {
            status: result.status,
            message: "Dados atualizados com sucesso!",
            data: result.data
          };
          return newResult;
        }
      })
      .catch(function(error) {
        if (error.response) {
          var messageError = "";
          if (error.response.data.message)
            messageError = error.response.data.message;
          else if (error.response.data.title)
            messageError = error.response.data.title;

          var newError = {
            status: error.response.data.status,
            message: messageError
          };
          return newError;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UseDeleteApi = (url, endpoint, id) => {
  try {
    const urlComplete =
      (url == "P" ? urlApiPaciente : urlApiMedico) + endpoint + id;
    const headers = { headers: { "Content-Type": "application/json" } };
    return axios
      .delete(urlComplete, headers)
      .then(result => {
        var newResult = {
          status: result.status,
          message: "Registro removido com sucesso!",
          data: result.data
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var newError = {
            status: error.response.data.status,
            message: error.response.data.message
          };
          return newError;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UseGetApiCEP = cep => {
  try {
    const urlComplete =
      "https://cors-anywhere.herokuapp.com/https://www.cepaberto.com/api/v3/cep?cep=" +
      cep;
    //return axios.get(urlComplete)
    return axios
      .get(urlComplete, {
        headers: {
          Authorization: `Token token=ed3c65f56f6e7ff359d039cd7118de57`
        }
      })
      .then(result => {
        var newResult = {
          status: result.status,
          data: result.data,
          headers: result.headers
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var message = "";
          if (error.response.data.message)
            message = error.response.data.message;
          else message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message: message
          };
          return newError;
        } else {
          var result = {
            status: 500,
            message: "Erro ao conectar com api."
          };
          return result;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UseGetApiURL = endpointComplete => {
  try {
    return axios
      .get(endpointComplete)
      .then(result => {
        var newResult = {
          status: result.status,
          data: result.data,
          headers: result.headers
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var message = "";
          if (error.response.data.message)
            message = error.response.data.message;
          else message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message: message
          };
          return newError;
        } else {
          var result = {
            status: 500,
            message: "Erro ao conectar com api."
          };
          return result;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

const UsePostApiURL = (endpointComplete, obj) => {
  try {
    const headers = {
      headers: { "Content-Type": "application/json", JSON: "true" }
    };
    console.log(headers);
    return axios
      .post(endpointComplete, obj, headers)
      .then(result => {
        var newResult = {
          status: result.status,
          message: "Cadastro realizado com sucesso!",
          data: result.data,
          headers: result.headers
        };
        return newResult;
      })
      .catch(function(error) {
        if (error.response) {
          var message = "";
          if (error.response.data.message)
            message = error.response.data.message;
          else message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message: message
          };
          return newError;
        } else {
          var result = {
            status: 500,
            message: "Erro ao conectar com api."
          };
          return result;
        }
      });
  } catch (error) {
    var result = {
      status: 500,
      message: "Erro."
    };
    return result;
  }
};

export {
  UseGetApi,
  UsePostApi,
  UsePutApi,
  UseDeleteApi,
  UseGetApiCEP,
  UseGetApiURL,
  UsePostApiURL
};
