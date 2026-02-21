import { Problem } from '../models/problem.model';

export const PROBLEMS: Problem[] = [
	{
		id: 1,
		title: 'Two Sum',
		difficulty: 'Easy',
		category: 'Arrays',
		description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
		examples: [
			{
				input: 'nums = [2,7,11,15], target = 9',
				output: '[0,1]',
				explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
			},
			{
				input: 'nums = [3,2,4], target = 6',
				output: '[1,2]',
			},
			{
				input: 'nums = [3,3], target = 6',
				output: '[0,1]',
			},
		],
		starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your solution here
}`,
		testCases: [
			{ input: 'twoSum([2,7,11,15], 9)', expected: '[0,1]' },
			{ input: 'twoSum([3,2,4], 6)', expected: '[1,2]' },
			{ input: 'twoSum([3,3], 6)', expected: '[0,1]' },
			{ input: 'twoSum([1,5,3,7], 8)', expected: '[1,2]' },
		],
		hints: [
			'A brute force approach would check every pair of numbers.',
			'Can you use a hash map to reduce the time complexity?',
			'For each number, check if target - number exists in the map.',
		],
	},
	{
		id: 2,
		title: 'Reverse String',
		difficulty: 'Easy',
		category: 'Strings',
		description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.`,
		examples: [
			{
				input: 's = ["h","e","l","l","o"]',
				output: '["o","l","l","e","h"]',
			},
			{
				input: 's = ["H","a","n","n","a","h"]',
				output: '["h","a","n","n","a","H"]',
			},
		],
		starterCode: `/**
 * @param {string[]} s
 * @return {string[]}
 */
function reverseString(s) {
  // Your solution here — modify and return s
}`,
		testCases: [
			{ input: 'reverseString(["h","e","l","l","o"])', expected: '["o","l","l","e","h"]' },
			{ input: 'reverseString(["H","a","n","n","a","h"])', expected: '["h","a","n","n","a","H"]' },
			{ input: 'reverseString(["a"])', expected: '["a"]' },
			{ input: 'reverseString(["a","b"])', expected: '["b","a"]' },
		],
		hints: [
			'Use two pointers, one at the start and one at the end.',
			'Swap the characters at the two pointers and move them toward the center.',
		],
	},
	{
		id: 3,
		title: 'Valid Parentheses',
		difficulty: 'Easy',
		category: 'Stacks',
		description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
		examples: [
			{ input: 's = "()"', output: 'true' },
			{ input: 's = "()[]{}"', output: 'true' },
			{ input: 's = "(]"', output: 'false' },
			{ input: 's = "([])"', output: 'true' },
		],
		starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your solution here
}`,
		testCases: [
			{ input: 'isValid("()")', expected: 'true' },
			{ input: 'isValid("()[]{}")', expected: 'true' },
			{ input: 'isValid("(]")', expected: 'false' },
			{ input: 'isValid("([])")', expected: 'true' },
			{ input: 'isValid("([)]")', expected: 'false' },
			{ input: 'isValid("")', expected: 'true' },
		],
		hints: [
			'Use a stack to keep track of opening brackets.',
			'When you encounter a closing bracket, check if the top of the stack matches.',
		],
	},
	{
		id: 4,
		title: 'Max Profit',
		difficulty: 'Easy',
		category: 'Arrays',
		description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
		examples: [
			{
				input: 'prices = [7,1,5,3,6,4]',
				output: '5',
				explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.',
			},
			{
				input: 'prices = [7,6,4,3,1]',
				output: '0',
				explanation: 'No profit is possible since prices only decrease.',
			},
		],
		starterCode: `/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  // Your solution here
}`,
		testCases: [
			{ input: 'maxProfit([7,1,5,3,6,4])', expected: '5' },
			{ input: 'maxProfit([7,6,4,3,1])', expected: '0' },
			{ input: 'maxProfit([2,4,1])', expected: '2' },
			{ input: 'maxProfit([1,2])', expected: '1' },
		],
		hints: [
			'Track the minimum price seen so far as you iterate.',
			'At each step, compute profit = current price - min price, and keep the max.',
		],
	},
	{
		id: 5,
		title: 'Palindrome Number',
		difficulty: 'Easy',
		category: 'Math',
		description: `Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

An integer is a palindrome when it reads the same forward and backward.`,
		examples: [
			{
				input: 'x = 121',
				output: 'true',
				explanation: '121 reads as 121 from left to right and from right to left.',
			},
			{
				input: 'x = -121',
				output: 'false',
				explanation: 'From left to right, it reads -121. From right to left it becomes 121-.',
			},
			{
				input: 'x = 10',
				output: 'false',
			},
		],
		starterCode: `/**
 * @param {number} x
 * @return {boolean}
 */
function isPalindrome(x) {
  // Your solution here
}`,
		testCases: [
			{ input: 'isPalindrome(121)', expected: 'true' },
			{ input: 'isPalindrome(-121)', expected: 'false' },
			{ input: 'isPalindrome(10)', expected: 'false' },
			{ input: 'isPalindrome(0)', expected: 'true' },
			{ input: 'isPalindrome(12321)', expected: 'true' },
		],
		hints: [
			'Negative numbers are never palindromes.',
			'Try reversing the number and comparing, or convert to string.',
		],
	},
	{
		id: 6,
		title: 'Merge Two Sorted Lists',
		difficulty: 'Easy',
		category: 'Linked Lists',
		description: `You are given two sorted arrays \`list1\` and \`list2\`. Merge the two arrays into one **sorted** array.

Return the merged sorted array.

*(Simplified from the linked-list version for browser execution.)*`,
		examples: [
			{
				input: 'list1 = [1,2,4], list2 = [1,3,4]',
				output: '[1,1,2,3,4,4]',
			},
			{
				input: 'list1 = [], list2 = []',
				output: '[]',
			},
			{
				input: 'list1 = [], list2 = [0]',
				output: '[0]',
			},
		],
		starterCode: `/**
 * @param {number[]} list1
 * @param {number[]} list2
 * @return {number[]}
 */
function mergeTwoLists(list1, list2) {
  // Your solution here
}`,
		testCases: [
			{ input: 'mergeTwoLists([1,2,4], [1,3,4])', expected: '[1,1,2,3,4,4]' },
			{ input: 'mergeTwoLists([], [])', expected: '[]' },
			{ input: 'mergeTwoLists([], [0])', expected: '[0]' },
			{ input: 'mergeTwoLists([1,3,5], [2,4,6])', expected: '[1,2,3,4,5,6]' },
		],
		hints: [
			'Use two pointers, one for each list.',
			'Compare elements at both pointers and push the smaller one.',
		],
	},
	{
		id: 7,
		title: 'FizzBuzz',
		difficulty: 'Easy',
		category: 'Math',
		description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.`,
		examples: [
			{
				input: 'n = 3',
				output: '["1","2","Fizz"]',
			},
			{
				input: 'n = 5',
				output: '["1","2","Fizz","4","Buzz"]',
			},
			{
				input: 'n = 15',
				output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
			},
		],
		starterCode: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
  // Your solution here
}`,
		testCases: [
			{ input: 'fizzBuzz(3)', expected: '["1","2","Fizz"]' },
			{ input: 'fizzBuzz(5)', expected: '["1","2","Fizz","4","Buzz"]' },
			{
				input: 'fizzBuzz(15)',
				expected: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
			},
		],
		hints: [
			'Check divisibility by 15 first (FizzBuzz), then 3 (Fizz), then 5 (Buzz).',
		],
	},
	{
		id: 8,
		title: 'Contains Duplicate',
		difficulty: 'Easy',
		category: 'Arrays',
		description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
		examples: [
			{ input: 'nums = [1,2,3,1]', output: 'true' },
			{ input: 'nums = [1,2,3,4]', output: 'false' },
			{ input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
		],
		starterCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // Your solution here
}`,
		testCases: [
			{ input: 'containsDuplicate([1,2,3,1])', expected: 'true' },
			{ input: 'containsDuplicate([1,2,3,4])', expected: 'false' },
			{ input: 'containsDuplicate([1,1,1,3,3,4,3,2,4,2])', expected: 'true' },
			{ input: 'containsDuplicate([])', expected: 'false' },
		],
		hints: [
			'A Set only stores unique values — compare its size to the array length.',
			'Alternatively, sort the array and check adjacent elements.',
		],
	},
	{
		id: 9,
		title: 'Valid Anagram',
		difficulty: 'Easy',
		category: 'Strings',
		description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an **anagram** of \`s\`, and \`false\` otherwise.

An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.`,
		examples: [
			{ input: 's = "anagram", t = "nagaram"', output: 'true' },
			{ input: 's = "rat", t = "car"', output: 'false' },
		],
		starterCode: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // Your solution here
}`,
		testCases: [
			{ input: 'isAnagram("anagram", "nagaram")', expected: 'true' },
			{ input: 'isAnagram("rat", "car")', expected: 'false' },
			{ input: 'isAnagram("a", "a")', expected: 'true' },
			{ input: 'isAnagram("ab", "ba")', expected: 'true' },
			{ input: 'isAnagram("abc", "ab")', expected: 'false' },
		],
		hints: [
			'Sort both strings and compare.',
			'Or use a frequency counter (hash map) for each character.',
		],
	},
	{
		id: 10,
		title: 'Climbing Stairs',
		difficulty: 'Easy',
		category: 'Dynamic Programming',
		description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
		examples: [
			{
				input: 'n = 2',
				output: '2',
				explanation: 'Two ways: (1+1) or (2)',
			},
			{
				input: 'n = 3',
				output: '3',
				explanation: 'Three ways: (1+1+1), (1+2), (2+1)',
			},
		],
		starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Your solution here
}`,
		testCases: [
			{ input: 'climbStairs(2)', expected: '2' },
			{ input: 'climbStairs(3)', expected: '3' },
			{ input: 'climbStairs(4)', expected: '5' },
			{ input: 'climbStairs(5)', expected: '8' },
			{ input: 'climbStairs(1)', expected: '1' },
		],
		hints: [
			'This is basically the Fibonacci sequence.',
			'f(n) = f(n-1) + f(n-2), with f(1)=1 and f(2)=2.',
		],
	},
	{
		id: 11,
		title: 'Maximum Subarray',
		difficulty: 'Medium',
		category: 'Arrays',
		description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
		examples: [
			{
				input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
				output: '6',
				explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
			},
			{ input: 'nums = [1]', output: '1' },
			{ input: 'nums = [5,4,-1,7,8]', output: '23' },
		],
		starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your solution here
}`,
		testCases: [
			{ input: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4])', expected: '6' },
			{ input: 'maxSubArray([1])', expected: '1' },
			{ input: 'maxSubArray([5,4,-1,7,8])', expected: '23' },
			{ input: 'maxSubArray([-1])', expected: '-1' },
		],
		hints: [
			"This is Kadane's algorithm.",
			'Track current sum — reset to current element if sum drops below it.',
		],
	},
	{
		id: 12,
		title: 'Group Anagrams',
		difficulty: 'Medium',
		category: 'Strings',
		description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

Each group should be sorted alphabetically, and the groups themselves should be sorted by the first element.`,
		examples: [
			{
				input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
				output: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
			},
			{ input: 'strs = [""]', output: '[[""]]' },
			{ input: 'strs = ["a"]', output: '[["a"]]' },
		],
		starterCode: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
function groupAnagrams(strs) {
  // Your solution here
  // Sort each group and sort groups by first element
}`,
		testCases: [
			{
				input: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"])',
				expected: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
			},
			{ input: 'groupAnagrams([""])', expected: '[[""]]' },
			{ input: 'groupAnagrams(["a"])', expected: '[["a"]]' },
		],
		hints: [
			'Use a sorted version of each string as a hash map key.',
			'Group strings with the same sorted key together.',
		],
	},
	{
		id: 13,
		title: 'Product of Array Except Self',
		difficulty: 'Medium',
		category: 'Arrays',
		description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in O(n) time and **without using the division operation**.`,
		examples: [
			{
				input: 'nums = [1,2,3,4]',
				output: '[24,12,8,6]',
			},
			{
				input: 'nums = [-1,1,0,-3,3]',
				output: '[0,0,9,0,0]',
			},
		],
		starterCode: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function productExceptSelf(nums) {
  // Your solution here
}`,
		testCases: [
			{ input: 'productExceptSelf([1,2,3,4])', expected: '[24,12,8,6]' },
			{ input: 'productExceptSelf([-1,1,0,-3,3])', expected: '[0,0,9,0,0]' },
			{ input: 'productExceptSelf([2,3])', expected: '[3,2]' },
		],
		hints: [
			'Build prefix products (left to right) and suffix products (right to left).',
			'The answer for index i is prefix[i] * suffix[i].',
		],
	},
	{
		id: 14,
		title: 'Longest Substring Without Repeating',
		difficulty: 'Medium',
		category: 'Strings',
		description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
		examples: [
			{
				input: 's = "abcabcbb"',
				output: '3',
				explanation: 'The answer is "abc", with the length of 3.',
			},
			{
				input: 's = "bbbbb"',
				output: '1',
				explanation: 'The answer is "b", with the length of 1.',
			},
			{
				input: 's = "pwwkew"',
				output: '3',
				explanation: 'The answer is "wke", with the length of 3.',
			},
		],
		starterCode: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your solution here
}`,
		testCases: [
			{ input: 'lengthOfLongestSubstring("abcabcbb")', expected: '3' },
			{ input: 'lengthOfLongestSubstring("bbbbb")', expected: '1' },
			{ input: 'lengthOfLongestSubstring("pwwkew")', expected: '3' },
			{ input: 'lengthOfLongestSubstring("")', expected: '0' },
			{ input: 'lengthOfLongestSubstring("au")', expected: '2' },
		],
		hints: [
			'Use the sliding window technique with a Set.',
			'Expand the window to the right; when a duplicate is found, shrink from the left.',
		],
	},
	{
		id: 15,
		title: 'Three Sum',
		difficulty: 'Medium',
		category: 'Arrays',
		description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets. Return triplets sorted in ascending order.`,
		examples: [
			{
				input: 'nums = [-1,0,1,2,-1,-4]',
				output: '[[-1,-1,2],[-1,0,1]]',
			},
			{ input: 'nums = [0,1,1]', output: '[]' },
			{ input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
		],
		starterCode: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
function threeSum(nums) {
  // Your solution here
}`,
		testCases: [
			{ input: 'threeSum([-1,0,1,2,-1,-4])', expected: '[[-1,-1,2],[-1,0,1]]' },
			{ input: 'threeSum([0,1,1])', expected: '[]' },
			{ input: 'threeSum([0,0,0])', expected: '[[0,0,0]]' },
		],
		hints: [
			'Sort the array first.',
			'Fix one element and use two pointers for the remaining two.',
			'Skip duplicates to avoid duplicate triplets.',
		],
	},
];
