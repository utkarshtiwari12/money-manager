import conf from "../conf/conf";
import { Client, Databases, ID } from "appwrite";

export class IncomeService {
    client = new Client();
    databases;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
    }

    // add income
    async addIncome(name, amount, userId) {
        try {
        return this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteIncomeCollectionId,
            ID.unique(),
            { name, amount, userId }
        );
        } catch (error) {
        throw console.log("ERROR ON ADDING INCOME", error);
        }
    }

    // to delete income
    async deleteIncome(id) {
        try {
        return this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteIncomeCollectionId,
            id
        );
        } catch (error) {
        throw console.log("ERROR ON ADDING INCOME", error);
        }
    }

    // get current income
    async getCurrentIncome(id) {
        try {
        return this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteIncomeCollectionId,
            id
        );
        } catch (error) {
        throw console.log("ERROR ON DELETING INCOME", error);
        }
    }

    // get all incomes
    async getAllIncomes() {
        try {
        return this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteIncomeCollectionId
        );
        } catch (error) {
        throw console.log("ERROR ON FETCHING CURRENT INCOME", error);
        }
    }
}

const incomeService = new IncomeService();
export default incomeService;
