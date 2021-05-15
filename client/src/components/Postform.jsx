import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useForm } from "../utils/hooks";

const PostForm = () => {
  const [error, setError] = useState({});

  const { onChange, onSubmit, values } = useForm(createPostcb, { body: "" });

  const [createPost, { err }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      console.log(result);
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      console.log(data);
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.write({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
    onError(err) {
      setError(err);
      console.log(err);
    },
  });

  function createPostcb() {
    createPost();
  }
  return (
    <Form
      style={{ marginRight: "163px", marginLeft: "10px" }}
      onSubmit={onSubmit}
    >
      <h1>Create New Post</h1>
      <Form.Input
        name="body"
        type="text"
        value={values.body}
        placeholder="Hi World"
        onChange={onChange}
      />
      <Button type="submit" primary>
        SUBMIT
      </Button>
    </Form>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default PostForm;
