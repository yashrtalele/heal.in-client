import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import MyTextInput from "../../components/TextInput";
import Icon from "react-native-vector-icons/Ionicons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportModal from "../../components/reportModal";
const forum = () => {
    const [question, setQuestion] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportIndex, setReportIndex] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const formatDate = (inputDate) => {
        const originalDateString = inputDate;
        const originalDate = new Date(originalDateString);

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const month = monthNames[originalDate.getMonth()];
        const day = originalDate.getDate();
        const year = originalDate.getFullYear();
        const formattedDate = `${month} ${day}, ${year}`;
        const date = formattedDate;
        return date;
    };
    const getQuestions = async () => {
        try {
            setCurrentUserId(await AsyncStorage.getItem("userId"));
            const response = await axios.get(
                process.env.API_HOST + "/api/user/allQuestions"
            );
            console.log(response.data);
            setQuestion(response.data);
            setQuestions(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getQuestions();
    }, []);
    const [questions, setQuestions] = useState(question);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [role, setRole] = useState("User");

    useEffect(() => {
        // Simulate loading questions from an API

        setQuestions(question);
    }, []);

    const handleViewMore = (index) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question, i) =>
                i === index
                    ? {
                          ...question,
                          expandedContent: !question.expandedContent,
                      }
                    : question
            )
        );
    };

    const handleAddComment = () => {
        console.log("Add Comment Hit..");
    };

    const handleViewMoreComments = (questionIndex) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          expandedComments: !question.expandedComments,
                      }
                    : question
            )
        );
    };

    const handleReportClick = (index) => {
        console.log("Report clicked for index: " + index);
        setModalVisible(true);
        setReportIndex(index);
    };
    const [searchText, setSearchText] = useState(""); // State for search term
    const handleSearch = (text) => {
        setSearchText(text);
        let tempData = [...question];
        tempData.forEach((question) => {
            console.log(question.question);
        });
        tempData = tempData.filter((question) =>
            question.question.toLowerCase().includes(text.toLowerCase())
        );
        setQuestions(tempData);
        console.log("Searching Hit.." + text);
    };

    const gradientColors = [
        "rgba(255,255,255,0.2)",
        "rgba(110,113,254,0.6)",
        "rgba(4,0,207,0.4)",
    ];

    return (
        <View>
            <LinearGradient colors={gradientColors} style={styles.gradient}>
                <ScrollView>
                    <View style={styles.body}>
                        <View style={styles.title}>
                            <Text style={{ fontSize: 20 }}>Q&A Forum</Text>
                        </View>
                        <View style={styles.verticalLine} />
                        <View style={styles.notes}>
                            <Text style={{ fontSize: 12 }}>
                                Please note: Whatever asked here will be visible
                                to the world. Need private guidance?{" "}
                                <TouchableOpacity
                                    style={styles.linkContainer}
                                    onPress={() => {
                                        router.push("/chats");
                                    }}
                                >
                                    <Text style={styles.link}>Click here</Text>
                                </TouchableOpacity>
                            </Text>
                        </View>
                        <View style={styles.searchBarContainer}>
                            <AntDesign
                                name="search1"
                                size={24}
                                color="black"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                style={styles.searchBar} // Customize styles based on your desired search bar appearance
                                placeholder="Search Videos"
                                placeholderTextColor="black"
                                onChangeText={handleSearch}
                                value={searchText}
                            />
                        </View>
                        <View style={styles.qnA}>
                            {/* Question List */}
                            <View style={styles.questionList}>
                                {/* Map through the questionsData array and render each question */}
                                {questions.map((question, index) => (
                                    <View key={index}>
                                        <View style={styles.question}>
                                            {/*Render Flag Content button for User*/}
                                            {role === "User" && (
                                                <TouchableOpacity
                                                    style={styles.reportButton}
                                                    onPress={() =>
                                                        handleReportClick(
                                                            question.public_qna_id
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        name="flag"
                                                        size={15}
                                                        color="#dd342c"
                                                    />
                                                </TouchableOpacity>
                                            )}
                                            <Text style={styles.questionTitle}>
                                                {question.question}
                                            </Text>
                                            <Text style={styles.author}>
                                                - {question.user_id.first_name}{" "}
                                                {question.user_id.last_name}
                                            </Text>
                                            <Text>
                                                {question.expandedContent ||
                                                expandedIndex === index
                                                    ? question.description
                                                    : question.description
                                                          .length > 100
                                                    ? question.description.substring(
                                                          0,
                                                          100
                                                      ) + "..."
                                                    : question.description}
                                                {/* Render "View More" button only if content is longer than 100 characters */}
                                                {question.description.length >
                                                    100 && (
                                                    <Text
                                                        style={
                                                            styles.viewMoreButton
                                                        }
                                                        onPress={() =>
                                                            handleViewMore(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {question.expandedContent ||
                                                        expandedIndex === index
                                                            ? "View Less"
                                                            : "View More"}
                                                    </Text>
                                                )}
                                            </Text>
                                            <Text style={styles.date}>
                                                {formatDate(
                                                    question.added_date
                                                )}
                                            </Text>
                                            <View
                                                style={
                                                    styles.commentButtonContainer
                                                }
                                            >
                                                <TouchableOpacity
                                                    style={
                                                        styles.viewCommentsButton
                                                    }
                                                    onPress={() =>
                                                        handleViewMoreComments(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.viewCommentsButtonText
                                                        }
                                                    >
                                                        {question.expandedComments
                                                            ? "Hide Comments"
                                                            : "View Comments"}
                                                    </Text>
                                                </TouchableOpacity>
                                                {/* {role === "Responder" && (
                                                    <TouchableOpacity
                                                        style={
                                                            styles.commentButton
                                                        }
                                                        onPress={() =>
                                                            handleAddComment()
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.commentButtonText
                                                            }
                                                        >
                                                            Add Comment
                                                        </Text>
                                                    </TouchableOpacity>
                                                )} */}
                                            </View>
                                            {/* Display comments if expanded */}
                                            {question.expandedComments && (
                                                <View
                                                    style={
                                                        styles.commentsContainer
                                                    }
                                                >
                                                    {question.comments.map(
                                                        (
                                                            comment,
                                                            commentIndex
                                                        ) => (
                                                            <View
                                                                key={
                                                                    commentIndex
                                                                }
                                                                style={
                                                                    styles.commentContainer
                                                                }
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.comment
                                                                    }
                                                                >
                                                                    {
                                                                        comment.comment
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    style={
                                                                        styles.commentDate
                                                                    }
                                                                >
                                                                    {formatDate(
                                                                        comment.comment_date
                                                                    )}
                                                                </Text>
                                                                <Text
                                                                    style={
                                                                        styles.commentAuthor
                                                                    }
                                                                >
                                                                    -{" "}
                                                                    {
                                                                        comment
                                                                            .user_id
                                                                            .first_name
                                                                    }{" "}
                                                                    {
                                                                        comment
                                                                            .user_id
                                                                            .last_name
                                                                    }
                                                                </Text>
                                                            </View>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                            {role === "Responder" && (
                                                <View
                                                    style={
                                                        styles.commentInputContainer
                                                    }
                                                >
                                                    <MyTextInput
                                                        placeholder="Add Comment"
                                                        style={
                                                            styles.commentInput
                                                        }
                                                    />
                                                </View>
                                            )}
                                            {/* Render Add Comment section for Responder */}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => {
                    setModalVisible(false);
                    setReportReason("");
                    setReportIndex("");
                }}
                style={styles.modal}
            >
                <ReportModal
                    currentUserId={currentUserId}
                    setModalVisible={setModalVisible}
                    reportIndex={reportIndex}
                    reportReason={reportReason}
                    setReportReason={setReportReason}
                    setReportIndex={setReportIndex}
                    api="qna"
                />
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    gradient: {
        width: "100%",
        height: "100%",
    },
    body: {
        marginLeft: "4%",
        marginRight: "4%",
    },
    title: {
        marginTop: "15%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    verticalLine: {
        height: 0.7,
        backgroundColor: "black",
        marginVertical: 5,
    },
    notes: {
        marginLeft: "5%",
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.4,
        borderColor: "gray",
        borderRadius: 10,
        marginBottom: 30,
        marginRight: 20,
        marginLeft: 10,
        backgroundColor: "white",
    },
    searchBar: {
        flex: 1,
        backgroundColor: "white",
        height: hp(4.4),
        fontSize: 14,
        borderBottomLeftRadius: 11,
        borderTopLeftRadius: 11,
    },
    searchButton: {
        backgroundColor: "green",
        paddingVertical: "1.53%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        borderBottomRightRadius: 11,
        borderTopRightRadius: 11,
    },
    searchButtonText: {
        color: "white",
        fontWeight: "bold",
        paddingLeft: "2%",
        paddingRight: "2%",
    },
    qnA: {
        flex: 1,
        padding: 10,
    },
    questionList: {
        marginBottom: "15%",
    },
    question: {
        backgroundColor: "rgba(0,0,255,0.07)",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
    },
    questionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    author: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#005B55",
        marginBottom: 5,
    },
    content: {
        fontSize: 16,
        fontWeight: "medium",
    },
    date: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#005B55",
        marginTop: 10,
    },
    viewMoreButton: {
        color: "#005B55",
        position: "absolute",
        fontWeight: "bold",
        bottom: 10,
        right: 10,
    },
    reportButton: {
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 100,
    },
    viewCommentsButton: {
        paddingVertical: "1.53%",
        justifyContent: "left",
        borderRadius: 11,
        marginTop: "2%",
        marginBottom: "2%",
    },
    viewCommentsButtonText: {
        color: "rgb(0, 91, 85)",
        fontWeight: "bold",
    },
    commentButton: {
        paddingVertical: "1%",
        marginLeft: "5%",
    },
    commentButtonText: {
        color: "rgb(0, 91, 85)",
        fontWeight: "bold",
    },
    commentButtonContainer: {
        flexDirection: "row",
        justifyContent: "inside",
        alignItems: "center",
        // marginTop: "2%",
        // marginBottom: "2%",
    },
    commentInputContainer: {
        flexDirection: "row",
        justifyContent: "inside",
        alignItems: "center",
    },
    commentInput: {
        flex: 1,
        backgroundColor: "white",
        height: hp(4),
        fontSize: 14,
        // borderRadius: 11,
    },
    linkContainer: { fontSize: 12, transform: [{ translateY: 2 }] },
    link: {
        fontSize: 12,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
    },
    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default forum;
