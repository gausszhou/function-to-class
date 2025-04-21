export class OllamaService {
    async getModels() {
        return fetch("http://localhost:11434/api/tags").then((res) => res.json());
    }
    async getAnswer(
        model: string,
        prompt: string,
        onStream: (text: string) => void
    ) {
        try {
            const response = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                }),
            });
            if (!response.ok) {
                throw new Error(`\t[ERROR]\t HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error(`\t[ERROR]\t HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const json = JSON.parse(chunk);
                onStream(json.message.content || "");
            }
        } catch (error) {
            console.error("\t[ERROR]\t fetching data:", error);
        }
    }
}
