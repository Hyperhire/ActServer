import { FAQDto } from "./dto/request.dto";
import { FAQModel } from "./schema/faq.schema";

const createFaq = async faqDto => {
  try {
    const faqs = await FAQModel.create(faqDto);

    return faqs;
  } catch (error) {
    throw error;
  }
};

const getFaqs = async query => {
  try {
    const { keyword } = query;
    const searchQuery = { show: true };
    if (keyword) {
      searchQuery["$or"] = [
        { question: { $regex: keyword, $options: "i" } },
        { answer: { $regex: keyword, $options: "i" } }
      ];
    }
    const faqs = await FAQModel.find(searchQuery);

    return faqs;
  } catch (error) {
    throw error;
  }
};

export default {
  createFaq,
  getFaqs
};
