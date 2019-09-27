import gql from 'graphql-tag';

export const ALL_FOLDERS_QUERY = gql`
  query allFolders($parentId: Int) {
    allFolders(parentId: $parentId) {
      id
      name
      color
      isStarred
      isFolder
      hasWritePermission
      contributors {
        id
        user {
          id
          firstName
          lastName
          profilePhoto
        }
      }
      nonMeContributors {
        id
        firstName
        lastName
        profilePhoto
      }
      user {
        id
        profilePhoto
        firstName
        lastName
      }
      parent {
        id
      }
      updatedAt
      createdAt
    }
  }
`;
export const RECENT_FILES_QUERY = gql`
  query recentFiles {
    recentFiles {
      id
      name
      updatedAt
      createdAt
      readAt
      isStarred
      hasWritePermission
      user {
        id
        firstName
        lastName
      }
      lastEditor {
        id
        email
        updatedFileAt
        readFileAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
export const MY_FILES_QUERY = gql`
  query myFiles {
    myFiles {
      id
      name
      updatedAt
      createdAt
      readAt
      contentHtml
      isStarred
      color
      hasWritePermission
      user {
        id
        firstName
        lastName
      }
      lastEditor {
        id
        email
        updatedFileAt
        readFileAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const STARRED_FILES_QUERY = gql`
  query starredFiles {
    starredFiles {
      id
      name
      hasWritePermission
      updatedAt
      createdAt
      readAt
      isStarred
      isFolder
      color
      user {
        id
        firstName
        lastName
      }
      contributors {
        id
        user {
          id
          firstName
          profilePhoto
        }
      }
      nonMeContributors {
        id
        firstName
        lastName
        profilePhoto
      }
      lastEditor {
        id
        email
        updatedFileAt
        readFileAt
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const ONLY_FOLDERS_QUERY = gql`
  query onlyFolders($parentId: Int, $exceptFolderId: Int) {
    onlyFolders(parentId: $parentId, exceptFolderId: $exceptFolderId) {
      id
      name
      isStarred
      hasWritePermission
      isFolder
      color
      user {
        id
        firstName
        lastName
      }
      contributors {
        id
        user {
          id
          firstName
          profilePhoto
        }
      }
      nonMeContributors {
        id
        firstName
        lastName
        profilePhoto
      }
      parent {
        id
      }
      updatedAt
      createdAt
    }
  }
`;

export const GET_FILE_PUBLIC_URL = gql`
  query getFilePublicUrl($id: Int!) {
    getFilePublicUrl(id: $id)
  }
`;

export const GET_FOLDER_PATH_QUERY = gql`
  query folderPath($id: Int) {
    folderPath(id: $id) {
      id
      name
      parent {
        id
      }
    }
  }
`;

export const ALL_USERS_QUERY = gql`
  query allUsers($filterQuery: String) {
    allUsers(filterQuery: $filterQuery) {
      id
      firstName
      lastName
      email
      profilePhoto
      createdAt
      role
      status
      fileCount
    }
  }
`;

export const CONFIGURATIONS_QUERY = gql`
  query configurations {
    configurations {
      id
      copyLink
    }
  }
`;

export const USER_CONFIGURATIONS_QUERY = gql`
  query userConfigurations {
    userConfigurations {
      id
      notifyMeOnShare
      notifyMeOnReply
      notifyMeOnMention
      notifyMeOnModify
    }
  }
`;

export const INVITED_USERS_QUERY = gql`
  query invitedUsers {
    invitedUsers {
      id
      firstName
      lastName
      email
      createdAt
      role
      status
    }
  }
`;

export const SEARCH_FILE_QUERY = gql`
  query searchFile($query: String!) {
    searchFile(query: $query) {
      highlight
      file {
        id
        name
        content
      }
    }
  }
`;

export const ACTIVITIES_QUERY = gql`
  query activities($first: Int, $skip: Int) {
    activities(first: $first, skip: $skip) {
      id
      action
      objectType
      createdAt
      actor {
        id
        profilePhoto
        firstName
        lastName
      }
      file {
        id
        name
        getUrl
        isFolder
        user {
          id
          firstName
          lastName
        }
      }
      contributor {
        file {
          id
          name
          getUrl
        }
        user {
          id
          firstName
          lastName
        }
      }
      star {
        id
        user {
          id
          firstName
          lastName
        }
        file {
          id
          name
          getUrl
        }
      }
    }
  }
`;

export const ACTIVITIES_META_QUERY = gql`
  query activitiesMeta {
    activitiesMeta {
      count
    }
  }
`;

export const CONVERSATION_QUERY = gql`
  query conversation($id: Int, $uuid: String) {
    conversation(id: $id, uuid: $uuid) {
      id
      uuid
      createdAt
      comments {
        id
        text
        createdAt
        user {
          id
          firstName
          lastName
          profilePhoto
        }
      }
    }
  }
`;

export const MYPROFILE_QUERY = gql`
  query myProfile {
    myProfile {
      id
      firstName
      lastName
      profilePhoto
    }
  }
`;
