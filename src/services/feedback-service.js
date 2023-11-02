import { prismaClient } from "../app/database.js";
import { createFeedbackValidation } from "../validation/feedback-validation.js";
import validate from "../validation/validation.js";

const create = async (request) => {
  request = validate(createFeedbackValidation, request);

  await prismaClient.feedback.create({ data: { description: request.description, username: request.username, guestId: request.guestUserId } });
};

export default { create };
