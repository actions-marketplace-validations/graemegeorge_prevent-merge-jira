function jiraStory(message) {
  const storyNum = message.match(/([a-z]+-[0-9]+)/gi);
  if (storyNum == null) {
    return null;
  }
  return storyNum[1];
}

module.exports = jiraStory;
