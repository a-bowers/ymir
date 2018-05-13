#ifndef UTILS_H
#define UTILS_H

#include <node.h>
#include <Python.h>

using namespace v8;

class PyThreadStateLock
{
public:
    PyThreadStateLock(void)
    {
        py_gil_state = PyGILState_Ensure();
    }

    ~PyThreadStateLock(void)
    {
        PyGILState_Release(py_gil_state);
    }

private:
    PyGILState_STATE py_gil_state;
};

void PyInit(void);
void PyExit(void* arg);

#endif /* UTILS_H */