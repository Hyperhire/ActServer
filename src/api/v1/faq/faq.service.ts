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

const getFaqByIdByAdmin = async (id) => {
    try {
        const faq = await FAQModel.findOne({ _id: id });

        return faq;
    } catch (error) {
        throw error;
    }
};

const getFaqsByAdmin = async (query) => {
    try {
        const { keyword } = query;
        const searchQuery = {} as any;
        if (keyword) {
            searchQuery["$or"] = [
                { question: { $regex: keyword, $options: "i" } },
                { answer: { $regex: keyword, $options: "i" } },
            ];
        }
        if (query?.show === "true" || query?.show === "false")
            searchQuery.show = query.show === "true";
        if (query?.from && query?.to) {
            searchQuery.$and = [
                { createdAt: { $gte: query.from } },
                { createdAt: { $lte: query.to } },
            ];
        } else if (query?.from) searchQuery.createdAt = { $gte: query.from };
        else if (query?.to) searchQuery.createdAt = { $gte: query.to };
        const faqs = await FAQModel.find(searchQuery);

        return faqs;
    } catch (error) {
        throw error;
    }
};

const deleteFaq = async (id) => {
    try {
        const updatedFaq = await FAQModel.findOneAndDelete(id).lean();
        return updatedFaq;
    } catch (error) {
        throw error;
    }
};

export default {
    createFaq,
    updateFaq,
    getFaqs,
    getFaqByIdByAdmin,
    getFaqsByAdmin,
    deleteFaq,
};
