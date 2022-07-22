import axios from "axios";

export default axios.create({
  baseURL: `https://todo-api-learning.herokuapp.com/v1`,
});
