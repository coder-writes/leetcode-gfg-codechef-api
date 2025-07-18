export const LEETCODE_BASE_URL = 'https://leetcode.com';
export const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql/';
export const LEETCODE_API_URL = 'https://leetcode.com/api';

export const GRAPHQL_QUERIES = {
  USER_PROFILE: `
    query getUserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        contestBadge {
          name
          expired
          hoverText
          icon
        }
        username
        githubUrl
        twitterUrl
        linkedinUrl
        profile {
          ranking
          userAvatar
          realName
          aboutMe
          school
          websites
          countryName
          company
          jobTitle
          skillTags
          postViewCount
          postViewCountDiff
          reputation
          reputationDiff
        }
      }
    }
  `,
  
  USER_BADGES: `
    query getUserBadges($username: String!) {
      matchedUser(username: $username) {
        badges {
          id
          name
          shortName
          displayName
          icon
          hoverText
          medal {
            slug
            config {
              iconGif
              iconGifBackground
            }
          }
          creationDate
          category
        }
      }
    }
  `,

  USER_CONTEST_INFO: `
    query getUserContestRanking($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `,

  USER_SUBMISSION_STATS: `
    query getUserStats($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        problemsSolvedBeatsStats {
          difficulty
          percentage
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `,

  USER_RECENT_SUBMISSIONS: `
    query getRecentSubmissions($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
        runtime
        url
        isPending
        memory
        hasNotes
        notes
      }
    }
  `,

  USER_CALENDAR: `
    query getUserCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          dccBadges {
            timestamp
            badge {
              name
              icon
            }
          }
          submissionCalendar
        }
      }
    }
  `,

  DAILY_QUESTION: `
    query questionOfToday {
      activeDailyCodingChallengeQuestion {
        date
        userStatus
        link
        question {
          acRate
          difficulty
          freqBar
          frontendQuestionId: questionFrontendId
          isFavor
          paidOnly: isPaidOnly
          status
          title
          titleSlug
          hasVideoSolution
          hasSolution
          topicTags {
            name
            id
            slug
          }
        }
      }
    }
  `,

  QUESTION_DETAIL: `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        content
        translatedTitle
        translatedContent
        isPaidOnly
        difficulty
        likes
        dislikes
        isLiked
        similarQuestions
        contributors {
          username
          profileUrl
          avatarUrl
          __typename
        }
        langToValidPlayground
        topicTags {
          name
          slug
          translatedName
          __typename
        }
        companyTagStats
        codeSnippets {
          lang
          langSlug
          code
          __typename
        }
        stats
        hints
        solution {
          id
          canSeeDetail
          __typename
        }
        status
        sampleTestCase
        metaData
        judgerAvailable
        judgeType
        mysqlSchemas
        enableRunCode
        envInfo
        book {
          id
          bookName
          pressName
          source
          shortDescription
          fullDescription
          bookImgUrl
          pressImgUrl
          productUrl
          __typename
        }
        isSubscribed
        isDailyQuestion
        dailyRecordStatus
        editorType
        ugcQuestionId
        style
        exampleTestcases
        __typename
      }
    }
  `,

  PROBLEMS_LIST: `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          acRate
          difficulty
          freqBar
          frontendQuestionId: questionFrontendId
          isFavor
          paidOnly: isPaidOnly
          status
          title
          titleSlug
          topicTags {
            name
            id
            slug
          }
          hasSolution
          hasVideoSolution
        }
      }
    }
  `,

  LANGUAGE_STATS: `
    query languageStats($username: String!) {
      matchedUser(username: $username) {
        languageProblemCount {
          languageName
          problemsSolved
        }
      }
    }
  `,

  SKILL_STATS: `
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
  `,

  TRENDING_DISCUSS: `
    query trendingDiscuss($first: Int!) {
      cachedTrendingCategoryTopics(first: $first) {
        id
        title
        commentCount
        viewCount
        pinned
        tags
        post {
          id
          voteCount
          creationDate
          isHidden
          author {
            username
            isActive
            nameColor
            activeBadge {
              displayName
              icon
            }
            profile {
              userAvatar
              reputation
            }
          }
          status
          coinRewards {
            id
            score
            description
          }
          content
          updationDate
          __typename
        }
        lastComment {
          id
          post {
            id
            author {
              isActive
              username
              __typename
            }
            peek
            creationDate
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `,

  DISCUSS_TOPIC: `
    query DiscussTopic($topicId: Int!) {
      topic(id: $topicId) {
        id
        viewCount
        topLevelCommentCount
        subscribed
        title
        pinned
        tags
        hideFromTrending
        post {
          id
          voteCount
          voteStatus
          content
          updationDate
          creationDate
          status
          isHidden
          coinRewards {
            id
            score
            description
            date
          }
          author {
            isDiscussAdmin
            isDiscussStaff
            username
            nameColor
            activeBadge {
              displayName
              icon
            }
            profile {
              userAvatar
              reputation
            }
            isActive
          }
        }
      }
    }
  `
};

export const DEFAULT_HEADERS = {
  'User-Agent': 'LeetCode API Client',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://leetcode.com',
  'Referer': 'https://leetcode.com'
};
