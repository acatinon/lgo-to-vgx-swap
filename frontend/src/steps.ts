import type { Context } from "./context";
import type { ERC20 } from "./utils/contracts";

import Approve from "./steps/Approve.svelte";
import Swap from "./steps/Swap.svelte";

export class StepManager {
    private steps: Step[];
    private currentStepIndex: number;
    private onStepChangedCallback?: (step: Step) => void;


    public constructor() {
        this.steps = [];
        this.currentStepIndex = 0;
        this.onStepChangedCallback = undefined;
    }

    public addStep(step: Step): void {
        this.steps.push(step);
    }

    public init(context: Context) {
        let currentStep;
        do {
            currentStep = this.steps[this.currentStepIndex];
        } while (currentStep.canBeSkipped(context));

        this.onStepChangedCallback!(currentStep);
    }

    public onStepChanged(callback: (step: Step) => void): any {
        this.onStepChangedCallback = callback;
    }
}

export abstract class Step {
    public abstract getComponent(): any;

    public abstract canBeSkipped(context: Context): boolean;
}

export class ApproveStep extends Step {

    public constructor() {
        super();
    }

    public getComponent() {
        return Approve;
    }

    public canBeSkipped(context: Context): boolean {
        return context.allowance!.lt(0);
    }
}

export class AWaitForApprovalConfirmationStep {

}

export class SwapStep extends Step {
    public getComponent() {
        return Swap;
    }

    public canBeSkipped(context: Context): boolean {
        return false;
    }
}