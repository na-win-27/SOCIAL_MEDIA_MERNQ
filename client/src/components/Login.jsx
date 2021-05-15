import React, { useState, useContext } from "react";
import { Button, Form, Container } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useForm } from "../utils/hooks";
import { AuthContext } from "../context/auth";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    password: "",
  };

  const { onChange, onSubmit, values } = useForm(signInUser, initialState);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result) {
      // console.log(result.data.login);
      context.login(result.data.login);
      props.history.push("./");
    },
    onError(err) {
      // console.log(err.graphQLErrors[0].extensions.exception.error);
      setErrors({ error: err.graphQLErrors[0].extensions.exception.error });
      //console.log(errors);
    },
    variables: values,
  });

  function signInUser() {
    loginUser();
  }
  return (
    <Container>
      <h2 className="page-title">Login</h2>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          value={values.username}
          onChange={onChange}
        />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          value={values.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 ? (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </Container>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
