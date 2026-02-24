export interface TestCase {
	input: string;
	expected: string;
	description?: string;
}

export interface Problem {
	id: number;
	title: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	category: string;
	description: string;
	examples: { input: string; output: string; explanation?: string }[];
	starterCode: string;
	testCases: TestCase[];
	hints?: string[];
	optimalComplexity: { time: string; space: string };
}
