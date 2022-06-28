# Minimum Cashflow Calculator

- This web application takes transactions between persons as input and calculates new transactions between persons so that total number of transactions are minimised. It also generates and displays a graphical network showing all the transactions for easy understanding of the user.
- A Greedy algorithm is used to find all the transactions. The greedy algorithm is implemented using max Heaps.
- A max Heap is also implemented from scratch in javascript.
- The overall time complexity of the algorithm is $O(nlogn$) .
- [vis.js](https://visjs.github.io/vis-network/docs/network/) is used to display the graphical network using an adjacency list containing the connection(edges/transactions) between nodes(persons).

![Screenshot (826)](https://user-images.githubusercontent.com/108319876/176115915-5436d3aa-343b-4f7d-84e4-390739b48a48.png)
