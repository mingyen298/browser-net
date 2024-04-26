
// import { Mutex } from 'async-mutex';
export function uuid() { return Math.random().toString(16).substring(2, 32); }

// import Queue from 'yocto-queue';
export class Queue<T> implements Iterable<T> {
    private elements: Record<number, T> = {};
    private head = 0;
    private tail = 0;

    constructor() {}

    enqueue(value: T): void {
        this.elements[this.tail] = value;
        this.tail++;
    }

    dequeue(): T | undefined {
        if (this.size === 0) {
            return undefined;
        }
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }

    clear(): void {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    get size(): number {
        return this.tail - this.head;
    }

    [Symbol.iterator](): Iterator<T> {
        let currentIndex = this.head;
        const elements = this.elements;
        const tail = this.tail;  // 將 tail 的值固定在定義迭代器時的值

        return {
            next: () => {  // 使用箭頭函數來確保 `this` 是指向正確的對象
                if (currentIndex < tail) {
                    const value = elements[currentIndex];
                    currentIndex++;
                    return { value, done: false };
                } else {
                    return { value: null, done: true };
                }
            }
        };
    }
}


// Example usage

// queue.enqueue(1);
// queue.enqueue(2);
// queue.enqueue(3);

// console.log(queue.dequeue()); // Output: 1
// console.log(queue.size);      // Output: 2

// queue.clear();
// console.log(queue.size);      // Output: 0

// // Using the queue with for...of loop
// queue.enqueue(4);
// queue.enqueue(5);
// queue.enqueue(6);
// for (const item of queue) {
//     console.log(item);        // Output: 4, 5, 6
// }

// // Converting the queue to an array
// const array = [...queue];
// console.log(array);           // Output: [4, 5, 6]


export class Mutex {
	private queue = new Queue<(value: unknown) => void>();
	private _isLocked = false;

	async lock() {
		if (!this._isLocked) {
			this._isLocked = true;
			return;
		}

		return new Promise(resolve => {
			this.queue.enqueue(resolve);
		});
	}

	unlock() {
		if (this.queue.size > 0) {
			const resolve = this.queue.dequeue();
			resolve(null);
		} else {
			this._isLocked = false;
		}
	}

	async withLock(task:()=>Promise<void>) {
		try {
			await this.lock();
			return await task();
		} finally {
			this.unlock();
		}
	}

	get isLocked() {
		return this._isLocked;
	}
}

/**
	await mutex.withLock(async () => {
        do somthing
	});
 */
