const projectModels = [
  {
    projectModel: {
      item: {
        description: "The open source codebase and curriculum. Learn to code for free together with millions of people."
      },
      isFavorite: true
    }
  },
  {
    projectModel: {
      item: {
        description: "JavaScript Style Guide"
      },
      isFavorite: true
    },

  },
  {
    projectModel: {
      item: {
        description: "技术面试必备基础知识"
      },
      isFavorite: true
    },
  }
]


export default function request() {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      projectModels
        ? resolve(projectModels)
        : reject({
            error: 'no data found.',
          }),
    );
  });
}
