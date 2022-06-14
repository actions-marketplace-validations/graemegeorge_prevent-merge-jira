const core = require('@actions/core');
const JiraApi = require('jira-client');

function getJiraLabels(story, user, token, url) {
  const jira = new JiraApi({
    protocol: 'https',
    host: url,
    username: user,
    password: token,
    apiVersion: '2',
    strictSSL: true
  });

  return jira
    .findIssue(story)
    .then((issue) => issue.fields.labels)
    .catch((err) => {
      console.error(err);
    });
}

async function run() {
  const branch = core.getInput('jira_story_source');
  core.info(branch);
  const matchedStoryId = branch.match(/([a-z]+-[0-9]+)/gi);
  core.info(matchedStoryId);

  if (!matchedStoryId) {
    core.setFailed('Jira story number not found');
    return;
  }

  const storyId = matchedStoryId[0];

  core.info(`Found ${storyId}...`);

  // fetch the jira API for the story information
  let labels = await getJiraLabels(
    storyId,
    core.getInput('jira_user'),
    core.getInput('jira_token'),
    core.getInput('jira_url')
  );

  if (!labels.includes(core.getInput('jira_approve_label'))) {
    core.setFailed('QA has not yet approved this pull request.');
    return;
  }

  if (labels.includes(core.getInput('jira_fail_label'))) {
    core.setFailed('QA has failed this pull request.');
    return;
  }

  core.info('QA has approved this pull request!');
}

module.exports = run;
