## Development Principles

-   **README included**  
    Clear overview of decisions, setup, and structure.  
    _Collaborative projects without READMEs are a house without a door. You have to break in._

-   **"6-Month Maintainability Index"**  
    _Boring and predictable > clever and flashy._  
    Code should make sense to me (or someone else) six months from now.  
    A minute of prevention now saves hours of pain later.

-   **Aggressive naming discipline**  
    Variables, functions, and files named for clarity, not cleverness.  
    If it takes a second read-through to understand what something does, the name isn't good enough.

-   **Small files (<100 LOC)**  
    Long files are avoidable complexity magnets. Small, focused files make mental parsing and navigation dramatically easier.

-   **Separation of concerns**  
    Props, logic, and styling are decoupled and modular — especially in UI components and backend logic.  
    Each file has a purpose.

-   **Flat schema over nested**  
    Code isn't a Russian doll. Nesting creates mental overhead and multiplies frustration.  
    One level deep is fine when it serves clarity — beyond that, it works against it.  
    Flat is readable. Flat is maintainable.

-   **Functional over abstract**  
    Abstractions feel clever but create complexity.  
    I prioritize functional, explicit code — it's faster to onboard, debug, and extend.

-   **Top-of-file comments + inline annotations**  
    Every key file begins with a purpose comment.  
    Complex logic is annotated in context. Future clarity is the goal.

-   **Small, intentional, incremental commits**  
    Git history should read like a narrative written in one-liners. Each commit:

    -   Tackles a _single logical concern_
    -   Modifies no more than 1–3 files unless necessary
    -   Avoids mixing unrelated logic or styling updates
    -   _How do you eat an elephant? One bite at a time._

-   **Sequential over parallel**  
    One logical thread at a time.  
    Parallel work muddies intent, multiplies complexity, and increases the surface area for failure.  
    Clean implementation comes from clean focus.

-   **Verbose commit messages**  
    Every commit explains both the _what_ and the _why_.  
    Future me should never have to guess what I was thinking — or why I was doing it.

-   **Two audiences: Developers and Users**  
    These are the only two groups that touch your code.  
    Everything I build is optimized for dev experience and user experience alike.

-   **Golden Rule of Code**  
    _Hospitable code, not hostile._  
    I aim to write code that feels welcoming to future collaborators — expressive, predictable, and easy to extend.
