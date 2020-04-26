import axios from 'axios';

const urlApi = process.env.REACT_APP_API_ENDPOINT

const UseGetApi = (endpoint) => {          
  
  try 
  {
      const urlComplete = urlApi+endpoint;                            
      return axios.get(urlComplete)
      .then(result => {          
        var newResult = {
          status: result.status,
          data: result.data,
          headers: result.headers
        }  
        return newResult;
      })
      .catch(function (error) {
        if (error.response) {
          
          var message = "";
          if(error.response.data.message)
            message = error.response.data.message;
          else
            message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message:message
          }   
          return newError;
        }
        else
        {
          var result = {
            status: 500,
            message:"Erro ao conectar com api."
          }           
          return result;
        } 
      });
    
  } catch (error) {
    var result = {
      status: 500,
      message:"Erro."
    }           
    return result;
  }  
};

const UsePostApi = (endpoint, obj) => {   
    
    try 
    {
      const urlComplete = urlApi+endpoint; 
      const headers = {headers: {'Content-Type': 'application/json'}};
      return axios.post(urlComplete, obj, headers)
      .then(result => {    
       var newResult = {
          status: result.status,
          message: "Cadastro realizado com sucesso!",
          data: result.data,
          headers: result.headers
        }   
        return newResult;
      })
      .catch(function (error) {
        if (error.response) {     

          var message = "";
          if(error.response.data.message)
            message = error.response.data.message;
          else
            message = "Erro inesperado";

          var newError = {
            status: error.response.data.status,
            message:message
          }   
          return newError;
        }
        else
        {
          var result = {
            status: 500,
            message:"Erro ao conectar com api."
          }           
          return result;
        } 
      });
      
    } catch (error) {
      var result = {
        status: 500,
        message:"Erro."
      }      
      return result;
    }    
};

const UsePutApi = (endpoint, id, obj) => {  
    try 
    {
      const urlComplete = urlApi+endpoint+id; 
      const headers = {headers: {'Content-Type': 'application/json'}};
      return axios.put(urlComplete,obj, headers)
      .then(result => {                
        if(result.data.status)
        {
          let newResult = {
            status: result.data.status,
            message: result.data.message
          }  
          return newResult;
        }
        else{
          let newResult = {
            status: result.status,
            message: "Dados atualizados com sucesso!",
            data: result.data,
          }  
          return newResult;
        }
      })
      .catch(function (error) {
        if (error.response) {  
          
          var messageError = "";          
          if(error.response.data.message)
            messageError = error.response.data.message
          else if(error.response.data.title)
            messageError = error.response.data.title

          var newError = {
            status: error.response.data.status,
            message:messageError  
          }   
          return newError;
        } 
      });
      
    } catch (error) {
      var result = {
        status: 500,
        message:"Erro."
      }      
      return result;
    }    
};

const UseDeleteApi = (endpoint, id) => {      
   
    try 
    {
      const urlComplete = urlApi+endpoint+id; 
      const headers = {headers: {'Content-Type': 'application/json'}};
      return axios.delete(urlComplete, headers)
      .then(result => {        
        var newResult = {
          status: result.status,
          message:"Alteração realizada com sucesso!",
          data: result.data
        }  
        return newResult;
      })
      .catch(function (error) {
        if (error.response) {       
          
          var newError = {
            status: error.response.data.status,
            message:error.response.data.message
          }   
          return newError;
        } 
      });  
      
    } catch (error) {
      var result = {
        status: 500,
        message:"Erro."
      }           
      return result;
    }    
};

export {
UseGetApi,
UsePostApi,
UsePutApi,
UseDeleteApi};