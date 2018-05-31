#include "FryCatch.h"
#include <iostream> 

FryCatch::FryCatch(const Napi::Env& env): env(env){
    // Empty for now

}

Napi::Value FryCatch::safelyExitToJS(const Napi::Value& value) {
    if (PyErr_Occurred() == NULL) {
        return value;
    }

    PyObject * pyErrorType;
    PyObject * pyErrorValue;
    PyObject * pyErrorTraceback;

    PyErr_Fetch(&pyErrorType, &pyErrorValue, &pyErrorTraceback);
    PyErr_NormalizeException(&pyErrorType, &pyErrorValue, &pyErrorTraceback);


    if (pyErrorType == NULL) {
        // Somehow we didn't get to the point
        return value;
    }

    PyObject * pyErrorName = PyObject_GetAttrString(pyErrorType, "__name__");
    PyObject * pyErrorDesc = PyObject_Str(pyErrorValue);

    std::string pyErrorNameStr = PyString_AS_STRING(pyErrorName);
    std::string pyErrorMessageStr = PyString_AS_STRING(pyErrorDesc);
    
    Napi::Error jsError = Napi::Error(this->env, Napi::String::New(this->env, pyErrorNameStr));
    jsError.Set("errType", Napi::String::New(this->env, pyErrorMessageStr));

    Py_XDECREF(pyErrorType);
    Py_XDECREF(pyErrorValue);
    Py_XDECREF(pyErrorTraceback);
    Py_XDECREF(pyErrorName);
    Py_XDECREF(pyErrorDesc);

    jsError.ThrowAsJavaScriptException();
}