import conf from "../conf/conf";
import { Client, Databases, ID } from "appwrite";

export class ExpenseService {
    client = new Client();
    databases;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
    }

    // TO ADD EXPENSE
    async addExpense(name, amount, userId) {
        try {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteExpenseCollectionId,
            ID.unique(),
            { name, amount, userId }
        );
        } catch (error) {
        throw console.log("ERROR ON ADDING EXPENSE", error);
        }
    }

    // TO DELETE EXPENSE
    async deleteExpense(id) {
        try {
        return await this.databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteExpenseCollectionId,
            id
        );
        } catch (error) {
        throw console.log("ERROR ON DELETING EXPENSE", error);
        }
    }

    // TO GET EXPENSES
    async getCurrentExpense({ id }) {
        try {
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteExpenseCollectionId,
            id
        );
        } catch (error) {
        throw console.log("ERROR ON FETCHING CURRENT EXPENSE", error);
        }
    }

    // TO GET ALL EXPENSES
    async getAllExpenses() {
        try {
        return this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteExpenseCollectionId
        );
        } catch (error) {
        throw console.log("ERROR ON FETCHING ALL EXPENSES", error);
        }
    }
}

const expenseService = new ExpenseService();
export default expenseService;
