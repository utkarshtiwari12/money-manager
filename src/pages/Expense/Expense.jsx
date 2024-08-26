import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import authservice from "@/appwrite/auth";
import { login } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import expenseService from "@/appwrite/expense.config";

const groupExpenseByDate = (expenses) => {
    return expenses.reduce((groupedExpenses, expense) => {
    const date = expense.$createdAt.slice(0, 10);
    if (!groupedExpenses[date]) {
        groupedExpenses[date] = [];
    }

    groupedExpenses[date].push(expense);
    return groupedExpenses;
    }, {});
};

const Expense = () => {
    const [expense, setExpense] = useState({
    name: "",
    amount: "",
    });
    const [allGroupedExpenses, setAllGroupedExpenses] = useState({});
    const [length, setLength] = useState(0);
    const [userId, setUserId] = useState("");
    const [loaderK, setLoaderK] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
    const { name, value } = e.target;

    setExpense((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        await expenseService.addExpense(expense.name, expense.amount, userId);
        console.log("EXPENSE ADDED SUCCESSFULLY");
        setExpense({
            name: "",
            amount: "",
        });
        } catch (error) {
        console.log("ERROR ON ADDING EXPENSE ON FRONT-END", error);
        }
    };

    const handleDelete = async (id) => {
        try {
        await expenseService.deleteExpense(id);
        console.log("EXPENSE DELETED SUCCESSFULLY");
        } catch (error) {
        console.log("ERROR ON DELETEING EXPENSE ON FRONT-END", error);
        }
    };

    const fetchUser = useCallback(async () => {
        try {
        const userData = await authservice.getCurrentAccount();
        if (userData) {
            dispatch(login(userData));
            setUserId(userData.$id);
            console.log("USER LOGGED IN SUCCESSFULLY");
        }

        const expenseData = await expenseService.getAllExpenses([]);
        const filteredExpenses = expenseData.documents.filter(
            (exp) => exp.userId === userId
        );
        setLength(filteredExpenses.length);
        const groupedData = groupExpenseByDate(filteredExpenses);

        if (groupedData) {
            setAllGroupedExpenses(groupedData);
        } else {
            setAllGroupedExpenses({});
        }

        setLoaderK(false);
        } catch (error) {
        console.log("ERROR:", error);
        setLoaderK(false);
        navigate("/auth");
        }
    }, [dispatch, navigate, userId, handleDelete, handleSubmit]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div className="lg:px-[4rem] px-5 pt-10 py-[1rem] font-poppins">
        {/* add expense section  */}
        <Card>
            <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>
                Add your expense in one single click
            </CardDescription>
            </CardHeader>
            <form action="" method="post" onSubmit={handleSubmit}>
            <CardContent>
                <div className="grid lg:grid-cols-3 gap-5 lg:gap-[3rem]">
                <div className="">
                    <Label htmlFor="name">Name</Label>
                    <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    className="capitalize"
                    value={expense.name}
                    onChange={handleChange}
                    required={true}
                    />
                </div>

                <div className="">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                    type="text"
                    id="amount"
                    name="amount"
                    placeholder="Amount"
                    className="capitalize"
                    value={expense.amount}
                    onChange={handleChange}
                    required={true}
                    />
                </div>

                <div className="flex flex-col gap-2 justify-end">
                    <Button
                    type="submit"
                    className="flex items-center gap-1 mt-3 lg:mt-0 hover:bg-[#fd366e] hover:text-white"
                    >
                    Add
                    </Button>
                </div>
                </div>
            </CardContent>
            </form>
        </Card>

        {/* all expenses section  */}
        {loaderK ? (
            <div className="mt-10 text-center">
            <div className="loader mx-auto"></div>
            </div>
        ) : (
            <div className="mt-10">
            <h2 className="text-xl font-semibold">All Expenses ({length})</h2>

            {Object.keys(allGroupedExpenses).length ? (
                <div className="mt-10 flex flex-col gap-y-6">
                {Object.keys(allGroupedExpenses).map((date) => (
                    <div className="flex flex-col gap-y-4" key={date}>
                    <div className="flex gap-x-3 items-center">
                        <i className="fa-solid fa-angles-right"></i>
                        <h2 className="text-lg font-semibold">
                        Expenses on {date}
                        </h2>
                    </div>
                    <hr />
                    <ul className="flex flex-col gap-y-2">
                        {allGroupedExpenses[date].map((item) => (
                        <Card className="flex items-center pt-6" key={item.$id}>
                            <CardContent className="flex w-full items-center justify-between flex-col lg:flex-row gap-5 lg:gap-0">
                            <div className="flex items-center justify-between lg:justify-start gap-8 w-full">
                                <div className="lg:w-[30%]">{item.name}</div>
                                <div className="flex items-center gap-1">
                                {" "}
                                <span>&#8377;</span>
                                <span>{item.amount}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex items-center border rounded-lg">
                                <input
                                    type="text"
                                    id="categorys"
                                    value={"Cash Outflow"}
                                    className="capitalize w-[80%] bg-transparent inline-flex p-2"
                                    readOnly={true}
                                />
                                <i className="fa-solid fa-arrow-trend-down text-red-500"></i>
                                </div>

                                <Button
                                className="flex items-center gap-1 hover:bg-[#fd366e] hover:text-white"
                                onClick={() => handleDelete(item.$id)}
                                >
                                <i className="fa-solid fa-trash"></i>
                                </Button>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            ) : (
                <div className="mt-10 flex flex-col gap-y-6">
                No Data Available. Please Create your First Entry
                </div>
            )}
            </div>
        )}
        </div>
    );
};

export default Expense;
