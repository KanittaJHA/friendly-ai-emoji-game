import React, { useState, useRef, useEffect } from "react";
import {
  RiCameraLine,
  RiPlayLine,
  RiRefreshLine,
  RiHistoryLine,
  RiStarLine,
  RiTimerLine,
  RiTrophyLine,
  RiStarFill,
} from "react-icons/ri";

const Screen = ({ isDarkTheme }) => {
  // Game State
  const [gameState, setGameState] = useState("idle");
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  // Camera State
  const [stream, setStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [cameraError, setCameraError] = useState("");

  // Game Data
  const [gameHistory, setGameHistory] = useState([]);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  // Emoji Database
  const emojiDatabase = [
    {
      emoji: "😊",
      name: "Happy",
      description: "ยิ้มแบบมีความสุข",
      difficulty: "easy",
    },
    {
      emoji: "😢",
      name: "Sad",
      description: "ทำหน้าเศร้า",
      difficulty: "easy",
    },
    {
      emoji: "😮",
      name: "Surprised",
      description: "แสดงความประหลาดใจ",
      difficulty: "medium",
    },
    {
      emoji: "😎",
      name: "Cool",
      description: "ทำท่าเท่ห์",
      difficulty: "medium",
    },
    {
      emoji: "😴",
      name: "Sleepy",
      description: "แสดงความง่วง",
      difficulty: "easy",
    },
    {
      emoji: "🤔",
      name: "Thinking",
      description: "ทำท่าคิด",
      difficulty: "medium",
    },
    {
      emoji: "😋",
      name: "Yummy",
      description: "แสดงความอร่อย",
      difficulty: "easy",
    },
    {
      emoji: "😤",
      name: "Angry",
      description: "ทำหน้าโกรธ",
      difficulty: "hard",
    },
    {
      emoji: "😚",
      name: "Kiss",
      description: "ส่งจูบหรือจุ๊บปาก",
      difficulty: "medium",
    },
    {
      emoji: "😵",
      name: "Dizzy",
      description: "ทำหน้าเวียนหัว",
      difficulty: "hard",
    },
  ];

  // Camera Functions
  const startCamera = async () => {
    try {
      console.log("🎥 Requesting camera...");
      setCameraError("Opening camera...");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      console.log("✅ Got Stream:", mediaStream);
      console.log("📹 Video Tracks:", mediaStream.getVideoTracks().length);
      console.log(
        "🔍 Track State:",
        mediaStream.getVideoTracks()[0]?.readyState
      );

      setStream(mediaStream);
      setCameraError("Stream received - connecting video...");

      setTimeout(() => {
        const video = videoRef.current;
        if (video && mediaStream) {
          console.log("🔗 Connecting stream to video...");
          video.srcObject = mediaStream;

          video.onloadeddata = () => {
            console.log("📊 Video Data Loaded");
            setCameraError("");
          };

          video.oncanplay = () => {
            console.log(
              "▶️ Video Can Play - Size:",
              video.videoWidth,
              "x",
              video.videoHeight
            );
          };

          video
            .play()
            .then(() => {
              console.log("✅ Video Playing Successfully!");
            })
            .catch((e) => {
              console.error("❌ Play Error:", e);
            });
        }
      }, 100);
    } catch (error) {
      console.error("❌ Camera Error:", error);
      setCameraError(`Error: ${error.message}`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      // Check if video is actually playing
      if (video.readyState < 2) {
        setFeedback("❌ Camera is not ready. Please wait a moment.");
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Mirror effect for selfie
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.scale(-1, 1);

      const photoData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedPhoto(photoData);

      // Analyze photo and get score
      analyzePhoto(photoData);
    } else {
      setFeedback("❌ Cannot capture photo. Please turn on the camera.");
    }
  };

  // Game Functions
  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojiDatabase.length);
    return emojiDatabase[randomIndex];
  };

  const startGame = async () => {
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    setCapturedPhoto(null);
    setFeedback("");

    // Start camera
    await startCamera();

    // Get first emoji
    const emoji = getRandomEmoji();
    setCurrentEmoji(emoji);

    // Start timer
    startTimer();
  };

  const startTimer = () => {
    setTimer(10);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Auto capture when timer ends
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // AI Photo Analysis Simulation
  const analyzePhoto = (photoData) => {
    stopTimer();

    // Simulate AI processing delay
    setTimeout(() => {
      // Simulate AI scoring (60-100%)
      const baseScore = Math.floor(Math.random() * 40) + 60;

      // Difficulty modifier
      let difficultyModifier = 1;
      if (currentEmoji.difficulty === "easy") difficultyModifier = 1.1;
      else if (currentEmoji.difficulty === "hard") difficultyModifier = 0.9;

      const finalScore = Math.min(
        100,
        Math.floor(baseScore * difficultyModifier)
      );

      // Calculate points
      let points = 0;
      let message = "";

      if (finalScore >= 90) {
        points = 100;
        message = "🎉 Awesome! It looks very similar!";
      } else if (finalScore >= 80) {
        points = 85;
        message = "👏 Great! It's close!";
      } else if (finalScore >= 70) {
        points = 70;
        message = "👍 Not bad! You're doing okay!";
      } else if (finalScore >= 60) {
        points = 50;
        message = "😅 Try again. It's not quite a match.";
      } else {
        points = 25;
        message = "😅 Don't give up! Try again.";
      }

      setScore((prev) => prev + points);
      setFeedback(`${message} (Round score: ${points})`);

      // Save to history
      const historyItem = {
        round: currentRound,
        emoji: currentEmoji.emoji,
        name: currentEmoji.name,
        difficulty: currentEmoji.difficulty,
        score: points,
        aiScore: finalScore,
        photo: photoData,
        timestamp: new Date().toLocaleString("en-US"),
      };

      setGameHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      // Next round or end game
      setTimeout(() => {
        if (currentRound < 5) {
          nextRound();
        } else {
          endGame();
        }
      }, 3000);
    }, 1500); // 1.5s processing time
  };

  const nextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setCapturedPhoto(null); // Clear captured photo
    setFeedback("");

    const emoji = getRandomEmoji();
    setCurrentEmoji(emoji);

    // Don't restart camera, keep using the existing stream
    startTimer();
  };

  const endGame = () => {
    setGameState("finished");
    // Don't stop camera, keep it for showing results
    setFeedback(`🎯 Game Over! Total Score: ${score}/500`);
  };

  const resetGame = () => {
    setGameState("idle");
    setScore(0);
    setCurrentRound(1);
    setTimer(10);
    setCapturedPhoto(null);
    setFeedback("");
    setCurrentEmoji(null);
    stopCamera(); // Stop camera on reset
    stopTimer();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopTimer();
    };
  }, []);

  return (
    <div
      className={`w-[800px] h-[500px] rounded-3xl p-6 flex flex-col transition-colors duration-300 ${
        isDarkTheme ? "bg-purple-dark" : "bg-background"
      }`}
    >
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2
            className={`text-2xl font-bold transition-colors duration-300 ${
              isDarkTheme ? "text-white" : "text-primary"
            }`}
          >
            📸 Emoji Photo Challenge
          </h2>
          {gameState === "playing" && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-tertiary">
                <RiTrophyLine />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center gap-1 text-purple">
                <span>Round {currentRound}/5</span>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <RiTimerLine />
                <span>{timer}s</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-primary text-white px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-purple transition-colors"
        >
          <RiHistoryLine />
          <span>History</span>
        </button>
      </div>

      <div className="flex flex-1 gap-6">
        {/* Left Panel - Game Info */}
        <div className="w-1/2 flex flex-col">
          {/* Emoji Challenge */}
          {gameState !== "idle" && currentEmoji && (
            <div
              className={`rounded-2xl p-4 mb-4 text-center shadow-sm transition-colors duration-300 ${
                isDarkTheme ? "bg-purple text-white" : "bg-white text-gray-700"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDarkTheme ? "text-white" : "text-gray-700"
                }`}
              >
                Match this Emoji!
              </h3>
              <div className="text-6xl mb-2">{currentEmoji.emoji}</div>
              <div className={isDarkTheme ? "text-secondary" : "text-purple"}>
                <p className="font-semibold">{currentEmoji.name}</p>
                <p
                  className={`text-sm ${
                    isDarkTheme ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {currentEmoji.description}
                </p>
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                    currentEmoji.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : currentEmoji.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentEmoji.difficulty === "easy"
                    ? "Easy"
                    : currentEmoji.difficulty === "medium"
                    ? "Medium"
                    : "Hard"}
                </div>
              </div>
            </div>
          )}

          {/* Game Controls */}
          <div
            className={`rounded-2xl p-4 mb-4 shadow-sm transition-colors duration-300 ${
              isDarkTheme ? "bg-purple text-white" : "bg-white"
            }`}
          >
            <div className="flex flex-col gap-3">
              {gameState === "idle" && (
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <RiPlayLine className="text-2xl" />
                  Start Game
                </button>
              )}

              {gameState === "playing" && (
                <button
                  onClick={capturePhoto}
                  disabled={timer === 0}
                  className="bg-tertiary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <RiCameraLine className="text-2xl" />
                  Capture Photo
                </button>
              )}

              <button
                onClick={resetGame}
                className="bg-gray-500 text-white px-6 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <RiRefreshLine className="text-xl" />
                Reset
              </button>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bg-gradient-to-r from-secondary to-quaternary text-white rounded-2xl p-4 text-center shadow-sm">
              <p className="font-semibold">{feedback}</p>
            </div>
          )}

          {/* Instructions */}
          {gameState === "idle" && (
            <div className="bg-purple-dark text-white rounded-2xl p-4 mt-auto shadow-sm">
              <h4 className="font-semibold mb-2">📋 วิธีการเล่น</h4>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• กดปุ่ม "เริ่มเกม" เพื่อเริ่มต้น</li>
                <li>• ดู Emoji และทำท่าเลียนแบบ</li>
                <li>• กดถ่ายรูปหรือรอให้เวลาหมด</li>
                <li>• AI จะให้คะแนนตามความเหมือน</li>
                <li>• เล่น 5 รอบเพื่อรับคะแนนรวม</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Panel - Camera/History */}
        <div className="w-1/2 flex flex-col">
          {!showHistory ? (
            /* Camera View */
            <div
              className={`rounded-2xl p-4 flex-1 shadow-sm transition-colors duration-300 ${
                isDarkTheme ? "bg-purple" : "bg-white"
              }`}
            >
              <h3
                className={`font-semibold mb-3 text-center ${
                  isDarkTheme ? "text-white" : "text-gray-700"
                }`}
              >
                📷 Camera
              </h3>

              <div className="relative w-full h-80 bg-yellow-200 border-4 border-blue-500 rounded-xl mb-3">
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded z-30">
                  {stream ? "🟢 Stream Found" : "🔴 No Stream"}
                </div>

                <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 text-xs rounded z-30">
                  {videoRef.current?.videoWidth
                    ? `📐 ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`
                    : "❓ No Size"}
                </div>

                {gameState === "playing" && timer > 0 && (
                  <div className="absolute top-12 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold z-30">
                    ⏱️ {timer}s
                  </div>
                )}

                {/* Video - Always show when there's a stream */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                  style={{
                    transform: "scaleX(-1)",
                    backgroundColor: "lime",
                    display: stream ? "block" : "none",
                  }}
                  playsInline
                  muted
                  autoPlay
                />

                {/* Captured Photo Overlay */}
                {capturedPhoto && (
                  <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center rounded-xl">
                    <div className="bg-white p-4 rounded-lg max-w-sm">
                      <img
                        src={capturedPhoto}
                        alt="Captured"
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <p className="text-center text-sm text-gray-600">
                        Captured Photo
                      </p>
                    </div>
                  </div>
                )}

                {/* No Stream Overlay */}
                {!stream && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    {cameraError ? (
                      <div className="text-center bg-white/90 p-4 rounded-lg">
                        <p className="text-red-600 text-sm mb-2">
                          {cameraError}
                        </p>
                        <button
                          onClick={startCamera}
                          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <div className="text-center bg-white/90 p-4 rounded-lg">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-700 text-sm">
                          Press Start Game
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <canvas
                ref={canvasRef}
                className="hidden"
                width={640}
                height={480}
              />
            </div>
          ) : (
            /* History View */
            <div
              className={`rounded-2xl p-4 flex-1 shadow-sm transition-colors duration-300 ${
                isDarkTheme ? "bg-purple" : "bg-white"
              }`}
            >
              <h3
                className={`font-semibold mb-3 flex items-center gap-2 ${
                  isDarkTheme ? "text-white" : "text-gray-700"
                }`}
              >
                <RiHistoryLine className="text-2xl" />
                Game History
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {gameHistory.length === 0 ? (
                  <p
                    className={`text-center py-8 ${
                      isDarkTheme ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    No Game History Yet
                  </p>
                ) : (
                  gameHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 flex items-center gap-3 transition-colors duration-300 ${
                        isDarkTheme ? "bg-purple-dark" : "bg-gray-50"
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div
                          className={`font-semibold text-sm ${
                            isDarkTheme ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {item.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isDarkTheme ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {item.timestamp}
                        </div>
                        <div
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                            item.difficulty === "easy"
                              ? "bg-green-100 text-green-800"
                              : item.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.difficulty === "easy"
                            ? "Easy"
                            : item.difficulty === "medium"
                            ? "Medium"
                            : "Hard"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-600 font-bold">
                          <RiStarFill className="w-4 h-4" />
                          {item.score}
                        </div>
                        <div
                          className={`text-xs ${
                            isDarkTheme ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          AI: {item.aiScore}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Screen;
