import React, { useEffect, useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import authservice from "@/appwrite/auth";
    import { useDispatch } from "react-redux";
    import { login } from "@/store/authSlice";
    import { Link, useNavigate } from "react-router-dom";
    import expenseService from "@/appwrite/expense.config";
    import incomeService from "@/appwrite/income.config";

    function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [expenseSum, setExpenseSum] = useState(0);
    const [todaysExpenseSum, setTodaysExpenseSum] = useState(0);
    const [incomeSum, setIncomeSum] = useState(0);
    const [incomeTodaysSum, setIncomeTodaysSum] = useState(0);
    const [result, setResult] = useState(0);
    const [loaderK, setLoaderK] = useState(false);

    const fetchData = useCallback(async () => {
        try {
        setLoaderK(true);
        const userData = await authservice.getCurrentAccount();
        if (userData) {
            dispatch(login(userData));
            setUserId(userData.$id);
            console.log("USER LOGGED IN SUCCESSFULLY");
        }

        const expenseData = await expenseService.getAllExpenses([]);
        let localExpenseSum = 0;
        let localExpenseTodaySum = 0;
        if (expenseData) {
            const filteredExpense = expenseData.documents.filter(
            (expense) => expense.userId === userId
            );

            let date = new Date();

            filteredExpense.forEach((exp) => {
            localExpenseSum += Number(exp.amount);

            let expenseDate = exp.$createdAt.slice(0, 10);
            let currentDate = date.toISOString().slice(0, 10);
            if (expenseDate === currentDate) {
                localExpenseTodaySum += Number(exp.amount);
            }
            });

            setExpenseSum(localExpenseSum);
            setTodaysExpenseSum(localExpenseTodaySum);
        }

        const incomeData = await incomeService.getAllIncomes([]);
        let localIncomeSum = 0;
        let localIncomeTodaysSum = 0;
        if (incomeData) {
            const filteredIncome = incomeData.documents.filter(
            (income) => income.userId === userId
            );

            let date = new Date();

            filteredIncome.forEach((inc) => {
            localIncomeSum += Number(inc.amount);

            let incomeDate = inc.$createdAt.slice(0, 10);
            let currentDate = date.toISOString().slice(0, 10);
            if (incomeDate === currentDate) {
                localIncomeTodaysSum += Number(inc.amount);
            }
            });

            setIncomeSum(localIncomeSum);
            setIncomeTodaysSum(localIncomeTodaysSum);
        }

        setResult(localIncomeSum - localSum);
        console.log(result);

        setLoaderK(false);
        } catch (error) {
        console.log("USER IS NOT LOGGED IN", error);
        navigate("/auth");
        }
    }, [dispatch, navigate, userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="lg:px-[4rem] px-5 pt-10 py-[1rem]">
        <div className="font-poppins text-4xl lg:text-7xl capitalize text-center pt-10 pb-10 lg:pb-20 font-semibold leading-[3rem]">
            Welcome to Money Manager
        </div>

        <div className="flex justify-center lg:gap-x-10 flex-wrap gap-y-4 lg:gap-y-10 flex-col lg:flex-row font-poppins">
            <Link className="lg:w-[30%]" to={"/expenses"}>
            <Card>
                <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>
                    This data is showing all the recorded expenses till now.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {!loaderK ? (
                    <div className="">
                    {expenseSum ? (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377;</span>
                        <span className="flex gap-x-2 items-center">
                            <p className="text-lg">{sum}</p>
                            <i className="fa-solid fa-arrow-trend-down text-red-500"></i>
                        </span>
                        </Button>
                    ) : (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>No Entry</span>
                        </Button>
                    )}
                    </div>
                ) : (
                    <div className="min-h-[5vh]">
                    <div className="loader"></div>
                    </div>
                )}
                </CardContent>
            </Card>
            </Link>

            <Link className="lg:w-[30%]" to={"/expenses"}>
            <Card>
                <CardHeader>
                <CardTitle>Today&apos;s Expenses</CardTitle>
                <CardDescription>
                    This data is showing all the expenses of today.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {!loaderK ? (
                    <div className="">
                    {todaysExpenseSum ? (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377;</span>
                        <span className="flex gap-x-2 items-center">
                            <p className="text-lg">{todaysExpenseSum}</p>
                            <i className="fa-solid fa-arrow-trend-down text-red-500"></i>
                        </span>
                        </Button>
                    ) : (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>No Entry</span>
                        </Button>
                    )}
                    </div>
                ) : (
                    <div className="min-h-[5vh]">
                    <div className="loader"></div>
                    </div>
                )}
                </CardContent>
            </Card>
            </Link>

            <Link className="lg:w-[30%]" to={"/incomes"}>
            <Card>
                <CardHeader>
                <CardTitle>Total Incomes</CardTitle>
                <CardDescription>
                    This data is showing all the recorded incomes till now.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {!loaderK ? (
                    <div className="">
                    {incomeSum ? (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377;</span>
                        <span className="flex gap-x-2 items-center">
                            <p className="text-lg">{incomeSum}</p>
                            <i className="fa-solid fa-arrow-trend-up text-green-500"></i>
                        </span>
                        </Button>
                    ) : (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>No Entry</span>
                        </Button>
                    )}
                    </div>
                ) : (
                    <div className="min-h-[5vh]">
                    <div className="loader"></div>
                    </div>
                )}
                </CardContent>
            </Card>
            </Link>

            <Link className="lg:w-[30%]" to={"/incomes"}>
            <Card>
                <CardHeader>
                <CardTitle>Today&apos;s Incomes</CardTitle>
                <CardDescription>
                    This data is showing all the incomes of today.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {!loaderK ? (
                    <div className="">
                    {incomeTodaysSum ? (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377;</span>
                        <span className="flex gap-x-2 items-center">
                            <p className="text-lg">{incomeTodaysSum}</p>
                            <i className="fa-solid fa-arrow-trend-up text-green-500"></i>
                        </span>
                        </Button>
                    ) : (
                        <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>No Entry</span>
                        </Button>
                    )}
                    </div>
                ) : (
                    <div className="min-h-[5vh]">
                    <div className="loader"></div>
                    </div>
                )}
                </CardContent>
            </Card>
            </Link>

            <Card className="lg:w-[30%]">
            <CardHeader>
                <CardTitle>Final Result</CardTitle>
                <CardDescription>
                This data shows remaining amount after subtracting total expenses
                from incomes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {!loaderK ? (
                <div className="">
                    {result ? (
                    <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377;</span>
                        <span className="flex gap-x-2 items-center">
                        <p className="text-lg">{result}</p>
                        {result >= 0 ? (
                            <i className="fa-solid fa-arrow-trend-up text-green-500"></i>
                        ) : (
                            <i className="fa-solid fa-arrow-trend-down text-red-500"></i>
                        )}
                        </span>
                    </Button>
                    ) : (
                    <Button className="flex hover:bg-[#fd366e] hover:text-white min-h-[5vh] items-center gap-1 text-xl">
                        <span>&#8377; 0</span>
                    </Button>
                    )}
                </div>
                ) : (
                <div className="min-h-[5vh]">
                    <div className="loader"></div>
                </div>
                )}
            </CardContent>
            </Card>
        </div>
        </div>
    );
}

export default Home;
