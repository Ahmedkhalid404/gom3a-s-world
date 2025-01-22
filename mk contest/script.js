$(document).ready(function () {
    $("#get-problems").click(async function () {
        const handlesInput = $("#handles-input").val().trim();
        if (!handlesInput) {
            alert("Please enter at least one handle.");
            return;
        }

        const handles = handlesInput
            .split(/[\s,]+/)
            .filter(Boolean); 

        const problemCount = Math.min(Math.max(parseInt($("#problem-count").val()) || 10, 1), 100);

        $("#problem-lists").html(""); 
        $("#loading").removeClass("d-none");

        try {
            const solvedProblems = new Set();
            for (const handle of handles) {
                const userStatus = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
                const data = await userStatus.json();
                if (data.status === "OK") {
                    data.result.forEach((submission) => {
                        if (submission.verdict === "OK") {
                            solvedProblems.add(submission.problem.contestId + "-" + submission.problem.index);
                        }
                    });
                }
            }

            const problemSet = await fetch("https://codeforces.com/api/problemset.problems");
            const problemData = await problemSet.json();
            if (problemData.status === "OK") {
                const problemsByRating = {};
                problemData.result.problems.forEach((problem) => {
                    const problemKey = problem.contestId + "-" + problem.index;
                    if (!solvedProblems.has(problemKey)) {
                        const rating = problem.rating || "Unrated";
                        if (!problemsByRating[rating]) problemsByRating[rating] = [];
                        problemsByRating[rating].push(problem);
                    }
                });

                renderProblemsByRating(problemsByRating, problemCount);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching data. Please try again.");
        } finally {
            $("#loading").addClass("d-none");
        }
    });

    function renderProblemsByRating(problemsByRating, problemCount) {
        for (const rating in problemsByRating) {
            const problemList = getRandomElements(problemsByRating[rating], problemCount);
            const problemHtml = problemList
                .map(
                    (p) => ` 
                    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                        <a href="https://codeforces.com/problemset/problem/${p.contestId}/${p.index}" target="_blank" class="text-primary text-decoration-none">
                            ${p.name}
                        </a>
                    </div>`
                )
                .join("");

            const collapsible = ` 
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#rating-${rating}">
                            Rating: ${rating}
                        </button>
                    </h2>
                    <div id="rating-${rating}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            ${problemHtml}
                        </div>
                    </div>
                </div>`;
            $("#problem-lists").append(collapsible);
        }
    }

    function getRandomElements(array, count) {
        const shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }
});
