const validate = (schema, request) => {
  const result = schema.safeParse(request);

  if (result.error) {
    throw result.error;
  } else {
    return result.data;
  }
};

export default validate;
