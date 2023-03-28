import { rest } from "msw";
import { setupServer } from "msw/node";

import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { Home } from "./Home";
import userEvent from "@testing-library/user-event";

const handlers = [
    rest.get("*jsonplaceholder.typicode.com*", async (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    userId: 1,
                    id: 1,
                    title: "title1",
                    body: "body1",
                    url: "img1.jpg",
                },
                {
                    userId: 2,
                    id: 2,
                    title: "title2",
                    body: "body2",
                    url: "img1.jpg",
                },
                {
                    userId: 3,
                    id: 3,
                    title: "title3",
                    body: "body3",
                    url: "img3.jpg",
                },
            ])
        );
    }),
];

const server = setupServer(...handlers);

describe("<Home />", () => {
    beforeAll(() => {
        server.listen();
    });

    afterEach(() => server.resetHandlers());

    afterAll(() => {
        server.close();
    });

    // Como a página faz uma requisição assincrona em uma pagina externa
    // é necessario que o teste tbm precise ser assincrono
    it("should render search, posts and load more", async () => {
        render(<Home />);

        const noMorePosts = screen.getByText(
            "Não há posts com as informações pesquisadas"
        );

        // Assim que os posts forem carregados, exibe tudo
        await waitForElementToBeRemoved(noMorePosts);

        //Quantas das tentativas (expect) eu quero se sejam ativadas
        expect.assertions(3);

        const search = screen.getByPlaceholderText(/type your search/i);
        expect(search).toBeInTheDocument();

        const images = screen.getAllByRole("img", { name: /title/i });
        expect(images).toHaveLength(3);

        const button = screen.getByRole("button", { name: /load more posts/i });
        expect(button).toBeInTheDocument();
    });

    it("should search for posts", async () => {
        render(<Home />);

        // const { debug } = render(<Home />);
        // debug();

        const noMorePosts = screen.getByText(
            "Não há posts com as informações pesquisadas"
        );
        await waitForElementToBeRemoved(noMorePosts);

        // expect.assertions(3);

        const search = screen.getByPlaceholderText(/type your search/i);
        expect(
            screen.getByRole("heading", { name: "title1" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "title2" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "title3" })
        ).toBeInTheDocument();

        //Caso procure o title1
        userEvent.type(search, "title1");
        expect(
            screen.getByRole("heading", { name: "title1" })
        ).toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "title2" })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("heading", { name: "title3" })
        ).not.toBeInTheDocument();

        //Caso nada seja digitado
        userEvent.clear(search);
        expect(
            screen.getByRole("heading", { name: "title1" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "title2" })
        ).toBeInTheDocument();

        //Caso não encontre
        userEvent.type(search, "blabla");
        expect(
            screen.getByText("Não há posts com as informações pesquisadas")
        ).toBeInTheDocument();
    });
});
