import { useState, useEffect } from 'react';

const getDailyQuests = () => {
  const today = new Date().toLocaleDateString();
  const savedQuests = localStorage.getItem(`quests-${today}`);

  if (savedQuests) {
    return JSON.parse(savedQuests);
  }

  const defaultQuests = [
    { name: "Watch OSI & TCP/IP video", xp: 10, completed: false },
    { name: "Practice `ping`, `ipconfig`, `tracert`", xp: 15, completed: false },
    { name: "Answer 4 self-quiz questions", xp: 10, completed: false },
    { name: "Write 3 key takeaways", xp: 5, completed: false },
    { name: "Reflect on why you chose cybersecurity", xp: 5, completed: false },
  ];

  localStorage.setItem(`quests-${today}`, JSON.stringify(defaultQuests));

  return defaultQuests;
};

export default function Home() {
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [questsState, setQuestsState] = useState(getDailyQuests());

  useEffect(() => {
    const level = Math.floor(userXP / 100) + 1;
    setUserLevel(level);
  }, [userXP]);

  const handleQuestComplete = (index) => {
    const newQuestsState = [...questsState];
    newQuestsState[index].completed = !newQuestsState[index].completed;
    setQuestsState(newQuestsState);
    const newXP = newQuestsState.filter(quest => quest.completed).reduce((acc, quest) => acc + quest.xp, 0);
    setUserXP(newXP);

    const today = new Date().toLocaleDateString();
    localStorage.setItem(`quests-${today}`, JSON.stringify(newQuestsState));
  };

  return (
    <div className="app-container">
      <h1>Cyber Quest - XP Tracker</h1>
      <div className="level-progress">
        <h3>Level: {userLevel}</h3>
        <div className="progress-bar" style={{ width: `${(userXP / 50) * 100}%` }}></div>
      </div>
      <div className="quests">
        {questsState.map((quest, index) => (
          <div key={index} className="quest">
            <input
              type="checkbox"
              checked={quest.completed}
              onChange={() => handleQuestComplete(index)}
            />
            <span>{quest.name}</span> (+{quest.xp} XP)
          </div>
        ))}
      </div>
    </div>
  );
}

