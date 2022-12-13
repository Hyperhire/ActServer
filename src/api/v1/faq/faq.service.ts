import { FAQDto } from "./dto/request.dto";
import { FAQModel } from "./schema/faq.schema";

const createFaq = async (faqDto) => {
  try {
    const faqs = await FAQModel.create(faqDto);

    return faqs;
  } catch (error) {
    throw error;
  }
};

const getFaqs = async () => {
  try {
    const faqs = await FAQModel.find({ show: true });

    return faqs;
  } catch (error) {
    throw error;
  }
};

export default {
  createFaq,
  getFaqs
};
