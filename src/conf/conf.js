const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteExpenseCollectionId: String(
        import.meta.env.VITE_APPWRITE_EXPENSE_COLLECTION_ID
    ),
    appwriteIncomeCollectionId: String(
        import.meta.env.VITE_APPWRITE_INCOME_COLLECTION_ID
    ),
};

export default conf;