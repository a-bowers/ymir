#include "utils.h"

void PyInit(void)
{
    Py_Initialize();
    PyEval_InitThreads();
    PyEval_ReleaseThread(PyThreadState_Get());
}

void PyExit(void* arg)
{
    PyGILState_Ensure();
    Py_Finalize();
}