// Tracks in-flight requests so they can be cancelled in bulk —
// used when the session expires or the admin logs out mid-request.

const activeRequests = new Set<AbortController>();

export function createRequestController(): AbortController {
    const controller = new AbortController();
    activeRequests.add(controller);
    return controller;
}

export function removeRequestController(controller: AbortController): void {
    activeRequests.delete(controller);
}

export function cancelOtherRequests(currentController?: AbortController): void {
    activeRequests.forEach((controller) => {
        if (controller !== currentController) {
            controller.abort();
        }
    });

    activeRequests.clear();

    if (currentController) {
        activeRequests.add(currentController);
    }
}

export function cancelAllRequests(): void {
    activeRequests.forEach((controller) => controller.abort());
    activeRequests.clear();
}
