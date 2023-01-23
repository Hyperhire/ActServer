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

const updateFaq = async (id, updateData) => {
    try {
        const updatedFaq = await FAQModel.findOneAndUpdate(
            { _id: id },
            { ...updateData, updatedAt: new Date().toISOString() },
            { new: true }
        ).lean();
        return updatedFaq;
    } catch (error) {
        throw error;
    }
};

const getFaqs = async (query) => {
    try {
        const { keyword } = query;
        const searchQuery = { show: true };
        if (keyword) {
            searchQuery["$or"] = [
                { question: { $regex: keyword, $options: "i" } },
                { answer: { $regex: keyword, $options: "i" } },
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
    updateFaq,
    getFaqs,
};
