export default function InjectDestructuredVariables(newTsxFileContents) {
	const scrollInjection = `const { scroll } = props.scroll ? props : { scroll: false };`;
	const userContextInjection = `const { frameloop, dev } = useContext(UserContextProvider);`;
	const inputContextInjection = `const { timestamp } = useContext(InputContextProvider);`;
	const injection = `
	${userContextInjection}
	${inputContextInjection}
	${scrollInjection}
	`;
	const searchStr = `const { nodes`;
	const regex = new RegExp(searchStr, 'g');
	console.log('InjectDestructuredVariables');

	return newTsxFileContents.replace(regex, `${injection}${searchStr}`);
}
