import type { DefaultTheme } from 'vitepress'

export const fundamentalsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Fundamentals & History',
    link: '/fundamentals/',
    items: [
      {
        text: 'Mathematical Preliminaries',
        collapsed: false,
        items: [
          { text: 'Linear Algebra Recap', link: '/fundamentals/math/linear-algebra' },
          { text: 'Probability & Statistics Primer', link: '/fundamentals/math/probability' },
          { text: 'Multivariate Calculus & Gradients', link: '/fundamentals/math/calculus' },
          { text: 'Convex Optimization Basics', link: '/fundamentals/math/convex-optimization' },
          { text: 'Information Theory (Entropy, KL, MI)', link: '/fundamentals/math/information-theory' }
        ]
      },
      {
        text: 'Learning Theory & Methodology',
        collapsed: false,
        items: [
          { text: 'Supervised vs. Unsupervised Learning', link: '/fundamentals/theory/learning-paradigms' },
          { text: 'Empirical Risk Minimization', link: '/fundamentals/theory/erm' },
          { text: 'Bias–Variance Tradeoff', link: '/fundamentals/theory/bias-variance' },
          { text: 'Generalization & VC Dimension', link: '/fundamentals/theory/generalization' },
          { text: 'PAC Learning', link: '/fundamentals/theory/pac-learning' },
          { text: 'Cross-Validation & Model Selection', link: '/fundamentals/theory/cross-validation' },
          { text: 'Regularization (L1, L2, Elastic Net)', link: '/fundamentals/theory/regularization' }
        ]
      },
      {
        text: 'Classical Regression',
        collapsed: false,
        items: [
          { text: 'Ordinary Least Squares (OLS)', link: '/fundamentals/classical/ols' },
          { text: 'Ridge & Lasso Regression', link: '/fundamentals/classical/ridge-lasso' },
          { text: 'Logistic Regression', link: '/fundamentals/classical/logistic-regression' },
          { text: 'Generalized Linear Models', link: '/fundamentals/classical/glm' }
        ]
      },
      {
        text: 'Classical Classification',
        collapsed: false,
        items: [
          { text: 'k-Nearest Neighbors', link: '/fundamentals/classical/knn' },
          { text: 'Naive Bayes', link: '/fundamentals/classical/naive-bayes' },
          { text: 'Linear & Quadratic Discriminant Analysis', link: '/fundamentals/classical/lda-qda' },
          { text: 'Perceptron (Rosenblatt, 1958)', link: '/fundamentals/classical/perceptron' },
          { text: 'Support Vector Machines (SVM)', link: '/fundamentals/classical/svm' },
          { text: 'Kernel Methods & The Kernel Trick', link: '/fundamentals/classical/kernels' }
        ]
      },
      {
        text: 'Trees & Ensembles',
        collapsed: true,
        items: [
          { text: 'Decision Trees (CART, ID3)', link: '/fundamentals/ensembles/decision-trees' },
          { text: 'Bagging & Random Forests', link: '/fundamentals/ensembles/random-forests' },
          { text: 'AdaBoost', link: '/fundamentals/ensembles/adaboost' },
          { text: 'Gradient Boosting & XGBoost', link: '/fundamentals/ensembles/gradient-boosting' }
        ]
      },
      {
        text: 'Unsupervised Learning',
        collapsed: true,
        items: [
          { text: 'k-Means', link: '/fundamentals/unsupervised/kmeans' },
          { text: 'Gaussian Mixture Models & EM', link: '/fundamentals/unsupervised/gmm-em' },
          { text: 'Hierarchical Clustering', link: '/fundamentals/unsupervised/hierarchical' },
          { text: 'PCA & SVD', link: '/fundamentals/unsupervised/pca-svd' },
          { text: 'Manifold Learning (t-SNE, UMAP)', link: '/fundamentals/unsupervised/manifold-learning' }
        ]
      },
      {
        text: 'Probabilistic & Sequence Models',
        collapsed: true,
        items: [
          { text: 'Bayesian Networks', link: '/fundamentals/probabilistic/bayes-nets' },
          { text: 'Markov Chains', link: '/fundamentals/probabilistic/markov-chains' },
          { text: 'Hidden Markov Models (HMM)', link: '/fundamentals/probabilistic/hmm' },
          { text: 'Conditional Random Fields (CRF)', link: '/fundamentals/probabilistic/crf' }
        ]
      },
      {
        text: 'A Brief History of ML',
        collapsed: true,
        items: [
          { text: 'Symbolic AI & The First AI Winter', link: '/fundamentals/history/symbolic-ai' },
          { text: 'Connectionism & The Perceptron Controversy', link: '/fundamentals/history/connectionism' },
          { text: 'Statistical Learning Theory (1990s)', link: '/fundamentals/history/statistical-learning' },
          { text: 'The Kernel Era (1995–2010)', link: '/fundamentals/history/kernel-era' },
          { text: 'The Deep Learning Renaissance (2012)', link: '/fundamentals/history/deep-learning-renaissance' }
        ]
      }
    ]
  }
]
