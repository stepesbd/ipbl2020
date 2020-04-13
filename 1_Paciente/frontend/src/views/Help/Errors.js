import React from "react";
import { Container, Button } from "shards-react";

const Errors = () => (
  <Container fluid className="main-content-container px-4 pb-4">
    <div className="error">
      <div className="error__content">
        <h2>500</h2>
        <h3>Ops, algo deu errado!</h3>
        <p>Ocorreu um problema inesperado. Por favor, tente novamente mais tarde.</p>
        <Button pill>&larr; Voltar</Button>
      </div>
    </div>
  </Container>
);

export default Errors;
