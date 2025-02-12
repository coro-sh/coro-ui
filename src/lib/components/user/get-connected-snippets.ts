import go from 'svelte-highlight/languages/go';
import type { CodeBlockLanguage } from '$lib/components/text/code-block-language';
import { java, javascript, python } from 'svelte-highlight/languages';

interface GetConnectedSnippet {
	name: string;
	codeBlock: string;
	language: CodeBlockLanguage;
}

export const getConnectedSnippets: GetConnectedSnippet[] = [
	{
		name: 'Go',
		codeBlock: `nc, err := nats.Connect("127.0.0.1", nats.UserCredentials("path_to_creds"))
if err != nil {
    log.Fatal(err)
}
defer nc.Close()

// Do something with the connection`,
		language: go
	},
	{
		name: 'Python',
		codeBlock: `nc = NATS()
await nc.connect("nats://localhost:4222", user_credentials="path_to_creds")
	
# Do something with the connection
await nc.close()`,
		language: python
	},
	{
		name: 'Java',
		codeBlock: `Options options = new Options.Builder()
    .server("nats://localhost:4222")
    .authHandler(Nats.credentials("path_to_creds"))
    .build();
Connection nc = Nats.connect(options);

// Do something with the connection
nc.close();`,
		language: java
	},
	{
		name: 'JavaScript',
		codeBlock: `const authenticator = credsAuthenticator(creds);
const nc = await connect({
	port: ns.port,
	authenticator: authenticator,
});`,
		language: javascript
	}
];
